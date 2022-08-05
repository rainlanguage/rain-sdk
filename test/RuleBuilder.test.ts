import { assert } from "chai";
import { BigNumber, ethers } from "ethers";
import { RuleBuilder, StateConfig, VM } from "../src";
import { Currency } from "../src/rule-builder/types";
import { areEqualConfigs, concat, op, paddedUInt32 } from "../src/utils";
import { Tier } from "./utils";


describe('SDK - RuleBuilder', () => {
  it('should correctly construct the single currency StateConfig with nested conditions', async () => {
    const currencyObject: Currency = {
      rules: [
        {
          quantityConditions: {
            conditions: [
              {
                conditions: [
                  {
                    struct: {
                      subject: 'before-time',
                      args: {
                        timestamp: 11111
                      }
                    },
                    operator: 'true'
                  },
                  {
                    struct: {
                      subject: 'has-min-tier',
                      args: {
                        tierAddress: '0xabcdef123456789',
                        minTier: Tier.FOUR
                      }
                    },
                    operator: 'true'
                  }
                ],
                operator: 'or'
              },
              {
                struct: {
                  subject: 'user-erc20-balance',
                  args: {
                    tokenAddress: '0xa1b2c3d4e5f689'
                  }
                },
                operator: 'gt',
                struct2: {
                  subject: 'constant',
                  args: {
                    value: BigNumber.from(50)
                  }
                }
              }
            ],
            operator: 'and'
          },
          priceConditions: {
            conditions: [
              {
                struct: {
                  subject: 'before-time',
                  args: {
                    timestamp: 11111
                  }
                },
                operator: 'true'
              }
            ],
            operator: 'true'
          },
          quantity: {
            struct: {
              subject: 'buy-units',
              args: {
                index: 1
              }
            }
          },
          price: {
            struct: {
              subject: 'constant',
              args: {
                value: BigNumber.from(5)
              }
            }
          }
        },
        {
          quantityConditions: {
            conditions: [
              {
                struct: {
                  subject: 'after-time',
                  args: {
                    timestamp: 11111,
                    exactTime: true
                  }
                },
                operator: 'true'
              }
            ],
            operator: 'true'
          },
          priceConditions: {
            conditions: [
              {
                struct: {
                  subject: 'before-time',
                  args: {
                    timestamp: 11111,
                    exactTime: true
                  }
                },
                operator: 'true'
              }
            ],
            operator: 'true'
          },
          quantity: {
            struct: {
              subject: 'buy-units',
              args: {
                index: 1
              }
            }
          },
          price: {
            struct: {
              subject: 'constant',
              args: {
                value: BigNumber.from(10)
              }
            }
          }
        },
      ],
      default: {
        quantity: {
          struct: {
            subject: 'constant',
            args: {
              value: ethers.constants.Zero
            }
          }
        },
        price: {
          struct: {
            subject: 'constant',
            args: {
              value: BigNumber.from(5)
            }
          }
        }
      },
      priceGlobalModifier: {
        type: 'discount',
        condition: {
          conditions: [
            {
              struct: {
                subject: 'has-any-tier',
                args: { tierAddress: '0x123456789abcdef' }
              },
              operator: 'true'
            }
          ],
          operator: 'true'
        },
        values: 25
      },
      pick: {
        quantities: 'max',
        prices: 'min'
      }
    }
    const resultConfig = new RuleBuilder([currencyObject]);

    const expectedConfig: StateConfig = {
      constants: [
        11111,
        '0xabcdef123456789',
        BigNumber.from(
          '0x' + 
          paddedUInt32('0xffffffff').repeat(5) + 
          paddedUInt32(0).repeat(3)
        ),
        '0xa1b2c3d4e5f689',
        BigNumber.from(50),
        11111,
        11111,
        11111,
        ethers.constants.Zero,
        BigNumber.from(5),
        BigNumber.from(10),
        BigNumber.from(5),
        '0x123456789abcdef',
        ethers.constants.MaxUint256,
        7500,
        10000
      ],
      sources: [
        concat([
          // q rule1
          op(VM.Opcodes.BLOCK_TIMESTAMP),
          op(VM.Opcodes.CONSTANT, 0),
          op(VM.Opcodes.LESS_THAN),
          op(VM.Opcodes.CONSTANT, 1),
          op(VM.Opcodes.CONTEXT, 0),
          op(VM.Opcodes.ITIERV2_REPORT),
          op(VM.Opcodes.CONSTANT, 2),
          op(VM.Opcodes.LESS_THAN),
          op(VM.Opcodes.ANY, 2),
          op(VM.Opcodes.CONSTANT, 3),
          op(VM.Opcodes.CONTEXT, 0),
          op(VM.Opcodes.IERC20_BALANCE_OF),
          op(VM.Opcodes.CONSTANT, 4),
          op(VM.Opcodes.GREATER_THAN),
          op(VM.Opcodes.EVERY, 2),
          // p rule1
          op(VM.Opcodes.BLOCK_TIMESTAMP),
          op(VM.Opcodes.CONSTANT, 5),
          op(VM.Opcodes.LESS_THAN),
          // q rule2
          op(VM.Opcodes.BLOCK_TIMESTAMP),
          op(VM.Opcodes.CONSTANT, 6),
          op(VM.Opcodes.LESS_THAN),
          op(VM.Opcodes.ISZERO),
          //p rule 2
          op(VM.Opcodes.BLOCK_TIMESTAMP),
          op(VM.Opcodes.CONSTANT, 7),
          op(VM.Opcodes.GREATER_THAN),
          op(VM.Opcodes.ISZERO),
          // quantities
          op(VM.Opcodes.STACK, 0),
          op(VM.Opcodes.CONTEXT, 1),
          op(VM.Opcodes.MUL, 2),
          op(VM.Opcodes.STACK, 2),
          op(VM.Opcodes.CONTEXT, 1),
          op(VM.Opcodes.MUL, 2),
          op(VM.Opcodes.CONSTANT, 8),
          op(VM.Opcodes.MAX, 3),
          // prices
          op(VM.Opcodes.STACK, 1),
          op(VM.Opcodes.CONSTANT, 9),
          op(VM.Opcodes.MUL, 2),
          op(VM.Opcodes.STACK, 3),
          op(VM.Opcodes.CONSTANT, 10),
          op(VM.Opcodes.MUL, 2),
          op(VM.Opcodes.CONSTANT, 11),
          op(VM.Opcodes.MIN, 3),
          // prices global modifier
          op(VM.Opcodes.CONSTANT, 12),
          op(VM.Opcodes.CONTEXT, 0),
          op(VM.Opcodes.ITIERV2_REPORT),
          op(VM.Opcodes.CONSTANT, 13),
          op(VM.Opcodes.LESS_THAN),
          op(VM.Opcodes.CONSTANT, 14),
          op(VM.Opcodes.CONSTANT, 15),
          op(VM.Opcodes.EAGER_IF),
          op(VM.Opcodes.MUL, 2),
          op(VM.Opcodes.CONSTANT, 15),
          op(VM.Opcodes.DIV, 2),
        ])
      ]
    }
    
    assert(
      areEqualConfigs(resultConfig, expectedConfig),
      `RuleBuilder did not generate correct StateConfig`
    );
  });

  it('should correctly construct the multi currency StateConfig', async () => {
    const currencyObject: Currency[] = [
      // currency 1
      {
        rules: [
          {
            quantityConditions: {
              conditions: [
                {
                  conditions: [
                    {
                      struct: {
                        subject: 'before-time',
                        args: {
                          timestamp: 11111
                        }
                      },
                      operator: 'true'
                    },
                    {
                      struct: {
                        subject: 'has-min-tier',
                        args: {
                          tierAddress: '0xabcdef123456789',
                          minTier: Tier.FOUR
                        }
                      },
                      operator: 'true'
                    }
                  ],
                  operator: 'or'
                },
                {
                  struct: {
                    subject: 'user-erc20-balance',
                    args: {
                      tokenAddress: '0xa1b2c3d4e5f689'
                    }
                  },
                  operator: 'gt',
                  struct2: {
                    subject: 'constant',
                    args: {
                      value: BigNumber.from(50)
                    }
                  }
                }
              ],
              operator: 'and'
            },
            priceConditions: {
              conditions: [
                {
                  struct: {
                    subject: 'before-time',
                    args: {
                      timestamp: 11111
                    }
                  },
                  operator: 'true'
                }
              ],
              operator: 'true'
            },
            quantity: {
              struct: {
                subject: 'buy-units',
                args: {
                  index: 1
                }
              }
            },
            price: {
              struct: {
                subject: 'constant',
                args: {
                  value: BigNumber.from(5)
                }
              }
            }
          },
          {
            quantityConditions: {
              conditions: [
                {
                  struct: {
                    subject: 'after-time',
                    args: {
                      timestamp: 11111,
                      exactTime: true
                    }
                  },
                  operator: 'true'
                }
              ],
              operator: 'true'
            },
            priceConditions: {
              conditions: [
                {
                  struct: {
                    subject: 'before-time',
                    args: {
                      timestamp: 11111,
                      exactTime: true
                    }
                  },
                  operator: 'true'
                }
              ],
              operator: 'true'
            },
            quantity: {
              struct: {
                subject: 'buy-units',
                args: {
                  index: 1
                }
              }
            },
            price: {
              struct: {
                subject: 'constant',
                args: {
                  value: BigNumber.from(10)
                }
              }
            }
          },
        ],
        default: {
          quantity: {
            struct: {
              subject: 'constant',
              args: {
                value: ethers.constants.Zero
              }
            }
          },
          price: {
            struct: {
              subject: 'constant',
              args: {
                value: BigNumber.from(5)
              }
            }
          }
        },
        priceGlobalModifier: {
          type: 'discount',
          condition: {
            conditions: [
              {
                struct: {
                  subject: 'has-any-tier',
                  args: { tierAddress: '0x123456789abcdef' }
                },
                operator: 'true'
              }
            ],
            operator: 'true'
          },
          values: 25
        },
        pick: {
          quantities: 'max',
          prices: 'min'
        }
      },
      // currency 2
      {
        rules: [
          {
            quantityConditions: {
              conditions: [
                {
                  struct: {
                    subject: 'before-time',
                    args: {
                      timestamp: 11111
                    }
                  },
                  operator: 'true'
                },
                {
                  struct: {
                    subject: 'has-min-tier',
                    args: {
                      tierAddress: '0xabcdef123456789',
                      minTier: Tier.FOUR
                    }
                  },
                  operator: 'true'
                }
              ],
              operator: 'or'
            },
            priceConditions: {
              conditions: [
                {
                  struct: {
                    subject: 'before-time',
                    args: {
                      timestamp: 11111
                    }
                  },
                  operator: 'true'
                },
                {
                  struct: {
                    subject: 'has-min-tier',
                    args: {
                      tierAddress: '0xabcdef123456789',
                      minTier: Tier.FOUR
                    }
                  },
                  operator: 'true'
                }
              ],
              operator: 'or'
            },
            quantity: {
              struct: {
                subject: 'buy-units',
                args: {
                  index: 1
                }
              }
            },
            price: {
              struct: {
                subject: 'constant',
                args: {
                  value: BigNumber.from(5)
                }
              }
            }
          },
        ],
        default: {
          quantity: {
            struct: {
              subject: 'constant',
              args: {
                value: ethers.constants.Zero
              }
            }
          },
          price: {
            struct: {
              subject: 'constant',
              args: {
                value: BigNumber.from(5)
              }
            }
          }
        },
        quantityGlobalModifier: {
          type: 'discount',
          condition: {
            conditions: [
              {
                struct: {
                  subject: 'has-any-tier',
                  args: { tierAddress: '0x123456789abcdef' }
                },
                operator: 'true'
              }
            ],
            operator: 'true'
          },
          values: 25
        },
        priceGlobalModifier: {
          type: 'discount',
          condition: {
            conditions: [
              {
                struct: {
                  subject: 'has-any-tier',
                  args: { tierAddress: '0x123456789abcdef' }
                },
                operator: 'true'
              }
            ],
            operator: 'true'
          },
          values: 25
        },
        pick: {
          quantities: 'max',
          prices: 'min'
        }
      }
    ]

    const resultConfig = new RuleBuilder(currencyObject);

    const expectedConfig: StateConfig = {
      constants: [
        //currency1 conditions' constants
        11111,
        '0xabcdef123456789',
        BigNumber.from(
          '0x' + 
          paddedUInt32('0xffffffff').repeat(5) + 
          paddedUInt32(0).repeat(3)
        ),
        '0xa1b2c3d4e5f689',
        BigNumber.from(50),
        11111,
        11111,
        11111,
        // currency2 conditions' constants
        11111,
        '0xabcdef123456789',
        BigNumber.from(
          '0x' + 
          paddedUInt32('0xffffffff').repeat(5) + 
          paddedUInt32(0).repeat(3)
        ),
        // currency1 quantities constants
        ethers.constants.Zero,
        // currency1 prices constants
        BigNumber.from(5),
        BigNumber.from(10),
        BigNumber.from(5),
        // currency1 prices global modifier
        '0x123456789abcdef',
        ethers.constants.MaxUint256,
        7500,
        10000,
        // currency2 quantities constants
        ethers.constants.Zero,
        // currency2 quantities global modifier
        '0x123456789abcdef',
        ethers.constants.MaxUint256,
        7500,
        10000,
        // currency2 prices
        BigNumber.from(5),
        BigNumber.from(5),
        // currency2 prices global modifier
        '0x123456789abcdef',
        ethers.constants.MaxUint256,
        7500,
        10000,
      ],
      sources: [
        concat([
          // currency1 quantity rule1
          op(VM.Opcodes.BLOCK_TIMESTAMP),
          op(VM.Opcodes.CONSTANT, 0),
          op(VM.Opcodes.LESS_THAN),
          op(VM.Opcodes.CONSTANT, 1),
          op(VM.Opcodes.CONTEXT, 0),
          op(VM.Opcodes.ITIERV2_REPORT),
          op(VM.Opcodes.CONSTANT, 2),
          op(VM.Opcodes.LESS_THAN),
          op(VM.Opcodes.ANY, 2),
          op(VM.Opcodes.CONSTANT, 3),
          op(VM.Opcodes.CONTEXT, 0),
          op(VM.Opcodes.IERC20_BALANCE_OF),
          op(VM.Opcodes.CONSTANT, 4),
          op(VM.Opcodes.GREATER_THAN),
          op(VM.Opcodes.EVERY, 2),
          // currency1 price rule1
          op(VM.Opcodes.BLOCK_TIMESTAMP),
          op(VM.Opcodes.CONSTANT, 5),
          op(VM.Opcodes.LESS_THAN),
          // currency1 quantity rule2
          op(VM.Opcodes.BLOCK_TIMESTAMP),
          op(VM.Opcodes.CONSTANT, 6),
          op(VM.Opcodes.LESS_THAN),
          op(VM.Opcodes.ISZERO),
          // currency1 price rule2
          op(VM.Opcodes.BLOCK_TIMESTAMP),
          op(VM.Opcodes.CONSTANT, 7),
          op(VM.Opcodes.GREATER_THAN),
          op(VM.Opcodes.ISZERO),
          // currency2 quantity  rule1
          op(VM.Opcodes.BLOCK_TIMESTAMP),
          op(VM.Opcodes.CONSTANT, 8),
          op(VM.Opcodes.LESS_THAN),
          op(VM.Opcodes.CONSTANT, 9),
          op(VM.Opcodes.CONTEXT, 0),
          op(VM.Opcodes.ITIERV2_REPORT),
          op(VM.Opcodes.CONSTANT, 10),
          op(VM.Opcodes.LESS_THAN),
          op(VM.Opcodes.ANY, 2),
          // currency2 price rule1
          op(VM.Opcodes.STACK, 4),
          // currency1 quantities
          op(VM.Opcodes.STACK, 0),
          op(VM.Opcodes.CONTEXT, 1),
          op(VM.Opcodes.MUL, 2),
          op(VM.Opcodes.STACK, 2),
          op(VM.Opcodes.CONTEXT, 1),
          op(VM.Opcodes.MUL, 2),
          op(VM.Opcodes.CONSTANT, 11),
          op(VM.Opcodes.MAX, 3),
          // currency1 prices
          op(VM.Opcodes.STACK, 1),
          op(VM.Opcodes.CONSTANT, 12),
          op(VM.Opcodes.MUL, 2),
          op(VM.Opcodes.STACK, 3),
          op(VM.Opcodes.CONSTANT, 13),
          op(VM.Opcodes.MUL, 2),
          op(VM.Opcodes.CONSTANT, 14),
          op(VM.Opcodes.MIN, 3),
          // currency1 prices global modifier
          op(VM.Opcodes.CONSTANT, 15),
          op(VM.Opcodes.CONTEXT, 0),
          op(VM.Opcodes.ITIERV2_REPORT),
          op(VM.Opcodes.CONSTANT, 16),
          op(VM.Opcodes.LESS_THAN),
          op(VM.Opcodes.CONSTANT, 17),
          op(VM.Opcodes.CONSTANT, 18),
          op(VM.Opcodes.EAGER_IF),
          op(VM.Opcodes.MUL, 2),
          op(VM.Opcodes.CONSTANT, 18),
          op(VM.Opcodes.DIV, 2),
          // currency2 quantities
          op(VM.Opcodes.STACK, 4),
          op(VM.Opcodes.CONTEXT, 1),
          op(VM.Opcodes.MUL, 2),
          op(VM.Opcodes.CONSTANT, 19),
          op(VM.Opcodes.MAX, 2),
          // currency2 quantitty global modifier
          op(VM.Opcodes.CONSTANT, 20),
          op(VM.Opcodes.CONTEXT, 0),
          op(VM.Opcodes.ITIERV2_REPORT),
          op(VM.Opcodes.CONSTANT, 21),
          op(VM.Opcodes.LESS_THAN),
          op(VM.Opcodes.CONSTANT, 22),
          op(VM.Opcodes.CONSTANT, 23),
          op(VM.Opcodes.EAGER_IF),
          op(VM.Opcodes.MUL, 2),
          op(VM.Opcodes.CONSTANT, 23),
          op(VM.Opcodes.DIV, 2),
          // currency2 prices
          op(VM.Opcodes.STACK, 5),
          op(VM.Opcodes.CONSTANT, 24),
          op(VM.Opcodes.MUL, 2),
          op(VM.Opcodes.CONSTANT, 25),
          op(VM.Opcodes.MIN, 2),
          // currency2 prices global modifier
          op(VM.Opcodes.CONSTANT, 26),
          op(VM.Opcodes.CONTEXT, 0),
          op(VM.Opcodes.ITIERV2_REPORT),
          op(VM.Opcodes.CONSTANT, 27),
          op(VM.Opcodes.LESS_THAN),
          op(VM.Opcodes.CONSTANT, 28),
          op(VM.Opcodes.CONSTANT, 29),
          op(VM.Opcodes.EAGER_IF),
          op(VM.Opcodes.MUL, 2),
          op(VM.Opcodes.CONSTANT, 29),
          op(VM.Opcodes.DIV, 2),
        ])
      ]
    }
    
    assert(
      areEqualConfigs(resultConfig, expectedConfig),
      `RuleBuilder did not generate correct StateConfig`
    );
  });
});