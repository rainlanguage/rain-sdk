import { assert } from 'chai';
import { ethers } from 'hardhat';
import {
  op,
  concat,
} from '../src/utils'
import {
  RainJS, StateConfig,
} from '../src';

import { BigNumber, Contract } from "ethers";
import type { CalculatorTest } from "../typechain/CalculatorTest";
import type { FixedPointMathOpsTest } from "../typechain/FixedPointMathOpsTest";
import type { TokenOpsTest } from "../typechain/TokenOpsTest";
import { deployErc20, deployErc721, deployErc1155, Time } from './utils';

const enum RainVMOpcode {
  SKIP,
  VAL,
  DUP,
  ZIPMAP,
  DEBUG,
  BLOCK_NUMBER,
  BLOCK_TIMESTAMP,
  SENDER,
  THIS,
  ADD,
  SATURATING_ADD,
  SUB,
  SATURATING_SUB,
  MUL,
  SATURATING_MUL,
  DIV,
  MOD,
  EXP,
  MIN,
  MAX,
}

const enum FixedPointMathOpcode {
  SKIP,
  VAL,
  DUP,
  ZIPMAP,
  DEBUG,
  SCALE18_MUL,
  SCALE18_DIV,
  SCALE18,
  SCALEN,
  SCALE_BY,
  ONE,
  DECIMALS,
}
const enum TokenOpsOpcode {
  SKIP,
  VAL,
  DUP,
  ZIPMAP,
  DEBUG,
  IERC20_BALANCE_OF,
  IERC20_TOTAL_SUPPLY,
  IERC721_BALANCE_OF,
  IERC721_OWNER_OF, 
  IERC1155_BALANCE_OF,
  IERC1155_BALANCE_OF_BATCH
}

describe('Comparing RainVM with RainJS', () => {

  it('should perform addition operation with block number', async () => {

    const [signer] = await ethers.getSigners();

    const constants = [1, 2, 3];
    // JSVM script
    const scriptJSVM: StateConfig = {
      constants: constants,
      sources: [
        concat([
          op(RainJS.Opcodes.BLOCK_NUMBER),
          op(RainJS.Opcodes.VAL, 0),
          op(RainJS.Opcodes.VAL, 1),
          op(RainJS.Opcodes.VAL, 2),
          op(RainJS.Opcodes.ADD, 3),
          op(RainJS.Opcodes.ADD, 2),
        ])
      ],
      stackLength: 6,
      argumentsLength: 0
    }

    // RainVM script
    const scriptVM: StateConfig = {
      constants: constants,
      sources: [
        concat([
          op(RainVMOpcode.BLOCK_NUMBER),
          op(RainVMOpcode.VAL, 0),
          op(RainVMOpcode.VAL, 1),
          op(RainVMOpcode.VAL, 2),
          op(RainVMOpcode.ADD, 3),
          op(RainVMOpcode.ADD, 2),
        ])
      ],
      stackLength: 6,
      argumentsLength: 0
    }

    // RainVM run
    const calculatorFactory = await ethers.getContractFactory("CalculatorTest");
    const calculator = (await calculatorFactory.deploy(scriptVM)) as CalculatorTest & Contract;
    const resultVM = await calculator.run();

    // JSVM run
    const rainJs = new RainJS(scriptJSVM, { signer });
    const resultJSVM = await rainJs.run();
    const block = await Time.currentBlock();
    const expected = BigNumber.from(block + (1 + 2 + 3));

    // Asserting 
    assert(
      expected.eq(resultJSVM),
      `
      The addition operation failed:
      expected ${expected}
      got ${resultJSVM}`
    );

    // RainVM vs JSVM
    assert(
      resultJSVM.eq(resultVM),
      `
       JSVM results mismatched with RainVM:
       expected ${resultVM}
       got ${resultJSVM}`
    );
  })

  it('should perform saturating add operation correctly', async () => {
    const constants = [
      "0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff0",
      "0x4a3bc6def"
    ];

    const scriptJSVM: StateConfig = {
      constants: constants,
      sources: [
        concat([
          op(RainJS.Opcodes.VAL, 0),
          op(RainJS.Opcodes.VAL, 1),
          op(RainJS.Opcodes.SATURATING_ADD, 2),
        ])
      ],
      stackLength: 3,
      argumentsLength: 0
    }

    const scriptVM: StateConfig = {
      constants: constants,
      sources: [
        concat([
          op(RainVMOpcode.VAL, 0),
          op(RainVMOpcode.VAL, 1),
          op(RainVMOpcode.SATURATING_ADD, 2),
        ])
      ],
      stackLength: 3,
      argumentsLength: 0
    }


    // RainVM run
    const calculatorFactory = await ethers.getContractFactory("CalculatorTest");
    const calculator = (await calculatorFactory.deploy(scriptVM)) as CalculatorTest & Contract;
    const resultVM = await calculator.run();

    // JSVM run
    const rainJs = new RainJS(scriptJSVM);
    const resultJSVM = await rainJs.run();
    const expected = ethers.constants.MaxUint256;

    // Asserting 
    assert(
      expected.eq(resultJSVM),
      `
       The saturating add operation failed:
       expected ${expected}
       got ${resultJSVM}`
    );

    // RainVM vs JSVM
    assert(
      resultJSVM.eq(resultVM),
      `
       JSVM results mismatched with RainVM:
       expected ${resultVM}
       got ${resultJSVM}`
    );
  })

  it('should perform saturating mul operation correctly', async () => {
    const constants = [
      "0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff0",
      "0x4a3bc6def"
    ];

    const scriptJSVM: StateConfig = {
      constants: constants,
      sources: [
        concat([
          op(RainJS.Opcodes.VAL, 0),
          op(RainJS.Opcodes.VAL, 1),
          op(RainJS.Opcodes.SATURATING_MUL, 2),
        ])
      ],
      stackLength: 3,
      argumentsLength: 0
    }

    const scriptVM: StateConfig = {
      constants: constants,
      sources: [
        concat([
          op(RainVMOpcode.VAL, 0),
          op(RainVMOpcode.VAL, 1),
          op(RainVMOpcode.SATURATING_MUL, 2),
        ])
      ],
      stackLength: 3,
      argumentsLength: 0
    }


    // RainVM run
    const calculatorFactory = await ethers.getContractFactory("CalculatorTest");
    const calculator = (await calculatorFactory.deploy(scriptVM)) as CalculatorTest & Contract;
    const resultVM = await calculator.run();

    // JSVM run
    const rainJs = new RainJS(scriptJSVM);
    const resultJSVM = await rainJs.run();
    const expected = ethers.constants.MaxUint256;

    // Asserting 
    assert(
      expected.eq(resultJSVM),
      `
       The saturating mul operation failed:
       expected ${expected}
       got ${resultJSVM}`
    );

    // RainVM vs JSVM
    assert(
      resultJSVM.eq(resultVM),
      `
       JSVM results mismatched with RainVM:
       expected ${resultVM}
       got ${resultJSVM}`
    );
  })

  it('should perform saturating sub operation correctly', async () => {
    const constants = [
      "0x22",
      "0x44"
    ];

    const scriptJSVM: StateConfig = {
      constants: constants,
      sources: [
        concat([
          op(RainJS.Opcodes.VAL, 0),
          op(RainJS.Opcodes.VAL, 1),
          op(RainJS.Opcodes.SATURATING_SUB, 2),
        ])
      ],
      stackLength: 3,
      argumentsLength: 0
    }

    const scriptVM: StateConfig = {
      constants: constants,
      sources: [
        concat([
          op(RainVMOpcode.VAL, 0),
          op(RainVMOpcode.VAL, 1),
          op(RainVMOpcode.SATURATING_SUB, 2),
        ])
      ],
      stackLength: 3,
      argumentsLength: 0
    }


    // RainVM run
    const calculatorFactory = await ethers.getContractFactory("CalculatorTest");
    const calculator = (await calculatorFactory.deploy(scriptVM)) as CalculatorTest & Contract;
    const resultVM = await calculator.run();

    // JSVM run
    const rainJs = new RainJS(scriptJSVM);
    const resultJSVM = await rainJs.run();
    const expected = ethers.constants.Zero;

    // Asserting 
    assert(
      expected.eq(resultJSVM),
      `
       The saturating sub operation failed:
       expected ${expected}
       got ${resultJSVM}`
    );

    // RainVM vs JSVM
    assert(
      resultJSVM.eq(resultVM),
      `
       JSVM results mismatched with RainVM:
       expected ${resultVM}
       got ${resultJSVM}`
    );
  })

  it('should perform mod operation correctly', async () => {
    const constants = [
      "90",
      "44"
    ];

    const scriptJSVM: StateConfig = {
      constants: constants,
      sources: [
        concat([
          op(RainJS.Opcodes.VAL, 0),
          op(RainJS.Opcodes.VAL, 1),
          op(RainJS.Opcodes.MOD, 2),
        ])
      ],
      stackLength: 3,
      argumentsLength: 0
    }

    const scriptVM: StateConfig = {
      constants: constants,
      sources: [
        concat([
          op(RainVMOpcode.VAL, 0),
          op(RainVMOpcode.VAL, 1),
          op(RainVMOpcode.MOD, 2),
        ])
      ],
      stackLength: 3,
      argumentsLength: 0
    }


    // RainVM run
    const calculatorFactory = await ethers.getContractFactory("CalculatorTest");
    const calculator = (await calculatorFactory.deploy(scriptVM)) as CalculatorTest & Contract;
    const resultVM = await calculator.run();

    // JSVM run
    const rainJs = new RainJS(scriptJSVM);
    const resultJSVM = await rainJs.run();
    const expected = ethers.constants.Two;

    // Asserting 
    assert(
      expected.eq(resultJSVM),
      `
       The MOD operation failed:
       expected ${expected}
       got ${resultJSVM}`
    );

    // RainVM vs JSVM
    assert(
      resultJSVM.eq(resultVM),
      `
       JSVM results mismatched with RainVM:
       expected ${resultVM}
       got ${resultJSVM}`
    );
  })

  it('should perform exponention operation correctly', async () => {
    const constants = [
      "2",
      "7"
    ];

    const scriptJSVM: StateConfig = {
      constants: constants,
      sources: [
        concat([
          op(RainJS.Opcodes.VAL, 0),
          op(RainJS.Opcodes.VAL, 1),
          op(RainJS.Opcodes.EXP, 2),
        ])
      ],
      stackLength: 3,
      argumentsLength: 0
    }

    const scriptVM: StateConfig = {
      constants: constants,
      sources: [
        concat([
          op(RainVMOpcode.VAL, 0),
          op(RainVMOpcode.VAL, 1),
          op(RainVMOpcode.EXP, 2),
        ])
      ],
      stackLength: 3,
      argumentsLength: 0
    }


    // RainVM run
    const calculatorFactory = await ethers.getContractFactory("CalculatorTest");
    const calculator = (await calculatorFactory.deploy(scriptVM)) as CalculatorTest & Contract;
    const resultVM = await calculator.run();

    // JSVM run
    const rainJs = new RainJS(scriptJSVM);
    const resultJSVM = await rainJs.run();
    const expected = BigNumber.from("128");

    // Asserting 
    assert(
      expected.eq(resultJSVM),
      `
       The EXP operation failed:
       expected ${expected}
       got ${resultJSVM}`
    );

    // RainVM vs JSVM
    assert(
      resultJSVM.eq(resultVM),
      `
       JSVM results mismatched with RainVM:
       expected ${resultVM}
       got ${resultJSVM}`
    );
  })

  it('should perform scale18_mul operation correctly', async () => {
    const constants = [
      "0x22",
      "0x44"
    ];

    const scriptJSVM: StateConfig = {
      constants: constants,
      sources: [
        concat([
          op(RainJS.Opcodes.VAL, 0),
          op(RainJS.Opcodes.VAL, 1),
          op(RainJS.Opcodes.SCALE18_MUL, 5),
        ])
      ],
      stackLength: 3,
      argumentsLength: 0
    }

    const scriptVM: StateConfig = {
      constants: constants,
      sources: [
        concat([
          op(FixedPointMathOpcode.VAL, 0),
          op(FixedPointMathOpcode.VAL, 1),
          op(FixedPointMathOpcode.SCALE18_MUL, 5),
        ])
      ],
      stackLength: 3,
      argumentsLength: 0
    }


    // RainVM run
    const fixedPointMathOpsFactory = await ethers.getContractFactory("FixedPointMathOpsTest");
    const fixedPointMath = (await fixedPointMathOpsFactory.deploy(scriptVM)) as FixedPointMathOpsTest & Contract;
    const resultVM = await fixedPointMath.run();

    // JSVM run
    const rainJs = new RainJS(scriptJSVM);
    const resultJSVM = await rainJs.run();
    const expected = BigNumber.from("0x22").mul("10000000000000").mul("0x44");

    // Asserting 
    assert(
      expected.eq(resultJSVM),
      `
       The SCALE18_MUL operation failed:
       expected ${expected}
       got ${resultJSVM}`
    );

    // RainVM vs JSVM
    assert(
      resultJSVM.eq(resultVM),
      `
       JSVM results mismatched with RainVM:
       expected ${resultVM}
       got ${resultJSVM}`
    );
  })

  it('should perform scale18_div operation correctly', async () => {
    const constants = [
      "0x22",
      "0x44"
    ];

    const scriptJSVM: StateConfig = {
      constants: constants,
      sources: [
        concat([
          op(RainJS.Opcodes.VAL, 0),
          op(RainJS.Opcodes.VAL, 1),
          op(RainJS.Opcodes.SCALE18_DIV, 10),
        ])
      ],
      stackLength: 3,
      argumentsLength: 0
    }

    const scriptVM: StateConfig = {
      constants: constants,
      sources: [
        concat([
          op(FixedPointMathOpcode.VAL, 0),
          op(FixedPointMathOpcode.VAL, 1),
          op(FixedPointMathOpcode.SCALE18_DIV, 10),
        ])
      ],
      stackLength: 3,
      argumentsLength: 0
    }


    // RainVM run
    const fixedPointMathOpsFactory = await ethers.getContractFactory("FixedPointMathOpsTest");
    const fixedPointMath = (await fixedPointMathOpsFactory.deploy(scriptVM)) as FixedPointMathOpsTest & Contract;
    const resultVM = await fixedPointMath.run();

    // JSVM run
    const rainJs = new RainJS(scriptJSVM);
    const resultJSVM = await rainJs.run();
    const expected = BigNumber.from("0x22").mul("100000000").div("0x44");

    // Asserting 
    assert(
      expected.eq(resultJSVM),
      `
       The SCALE18_DIV operation failed:
       expected ${expected}
       got ${resultJSVM}`
    );

    // RainVM vs JSVM
    assert(
      resultJSVM.eq(resultVM),
      `
       JSVM results mismatched with RainVM:
       expected ${resultVM}
       got ${resultJSVM}`
    );
  })

  it('should perform scale18 operation correctly', async () => {
    const constants = [
      "220000000000000000012345"
    ];

    const scriptJSVM: StateConfig = {
      constants: constants,
      sources: [
        concat([
          op(RainJS.Opcodes.VAL, 0),
          op(RainJS.Opcodes.SCALE18, 22),
        ])
      ],
      stackLength: 2,
      argumentsLength: 0
    }

    const scriptVM: StateConfig = {
      constants: constants,
      sources: [
        concat([
          op(FixedPointMathOpcode.VAL, 0),
          op(FixedPointMathOpcode.SCALE18, 22),
        ])
      ],
      stackLength: 2,
      argumentsLength: 0
    }


    // RainVM run
    const fixedPointMathOpsFactory = await ethers.getContractFactory("FixedPointMathOpsTest");
    const fixedPointMath = (await fixedPointMathOpsFactory.deploy(scriptVM)) as FixedPointMathOpsTest & Contract;
    const resultVM = await fixedPointMath.run();

    // JSVM run
    const rainJs = new RainJS(scriptJSVM);
    const resultJSVM = await rainJs.run();
    const expected = BigNumber.from("22000000000000000001");

    // Asserting 
    assert(
      expected.eq(resultJSVM),
      `
       The SCALE18 operation failed:
       expected ${expected}
       got ${resultJSVM}`
    );

    // RainVM vs JSVM
    assert(
      resultJSVM.eq(resultVM),
      `
       JSVM results mismatched with RainVM:
       expected ${resultVM}
       got ${resultJSVM}`
    );
  })

  it('should perform scalen operation correctly', async () => {
    const constants = [
      "44371183800000000001"
    ];

    const scriptJSVM: StateConfig = {
      constants: constants,
      sources: [
        concat([
          op(RainJS.Opcodes.VAL, 0),
          op(RainJS.Opcodes.SCALEN, 3),
        ])
      ],
      stackLength: 2,
      argumentsLength: 0
    }

    const scriptVM: StateConfig = {
      constants: constants,
      sources: [
        concat([
          op(FixedPointMathOpcode.VAL, 0),
          op(FixedPointMathOpcode.SCALEN, 3),
        ])
      ],
      stackLength: 2,
      argumentsLength: 0
    }


    // RainVM run
    const fixedPointMathOpsFactory = await ethers.getContractFactory("FixedPointMathOpsTest");
    const fixedPointMath = (await fixedPointMathOpsFactory.deploy(scriptVM)) as FixedPointMathOpsTest & Contract;
    const resultVM = await fixedPointMath.run();

    // JSVM run
    const rainJs = new RainJS(scriptJSVM);
    const resultJSVM = await rainJs.run();
    const expected = BigNumber.from("44371");

    // Asserting 
    assert(
      expected.eq(resultJSVM),
      `
       The SCALEN operation failed:
       expected ${expected}
       got ${resultJSVM}`
    );

    // RainVM vs JSVM
    assert(
      resultJSVM.eq(resultVM),
      `
       JSVM results mismatched with RainVM:
       expected ${resultVM}
       got ${resultJSVM}`
    );
  })

  it('should perform scale_by operation correctly', async () => {
    const constants = [
      "2000",
    ];

    const scriptJSVM: StateConfig = {
      constants: constants,
      sources: [
        concat([
          op(RainJS.Opcodes.VAL, 0),
          op(RainJS.Opcodes.SCALE_BY, 253),
        ])
      ],
      stackLength: 2,
      argumentsLength: 0
    }

    const scriptVM: StateConfig = {
      constants: constants,
      sources: [
        concat([
          op(FixedPointMathOpcode.VAL, 0),
          op(FixedPointMathOpcode.SCALE_BY, 253),
        ])
      ],
      stackLength: 2,
      argumentsLength: 0
    }


    // RainVM run
    const fixedPointMathOpsFactory = await ethers.getContractFactory("FixedPointMathOpsTest");
    const fixedPointMath = (await fixedPointMathOpsFactory.deploy(scriptVM)) as FixedPointMathOpsTest & Contract;
    const resultVM = await fixedPointMath.run();

    // JSVM run
    const rainJs = new RainJS(scriptJSVM);
    const resultJSVM = await rainJs.run();
    const expected = BigNumber.from("2");

    // Asserting 
    assert(
      expected.eq(resultJSVM),
      `
       The SCALE_BY operation failed:
       expected ${expected}
       got ${resultJSVM}`
    );

    // RainVM vs JSVM
    assert(
      resultJSVM.eq(resultVM),
      `
       JSVM results mismatched with RainVM:
       expected ${resultVM}
       got ${resultJSVM}`
    );
  })

  it('should return the balnce of an ERC20 token', async () => {

    // Deploying and minting tokens
    const signers = await ethers.getSigners();
    let account = signers[0];
    
    const rTKN = await deployErc20(account);
    await rTKN.deployed()

    // Generating script
    const constants = [
      rTKN.address,
      BigNumber.from(await account.getAddress())
    ];

    // JSVM Script
    const scriptJSVM: StateConfig = {
      constants: constants,
      sources: [
        concat([
          op(RainJS.Opcodes.VAL, 0),
          op(RainJS.Opcodes.SENDER),
          op(RainJS.Opcodes.IERC20_BALANCE_OF),
        ])
      ],
      stackLength: 3,
      argumentsLength: 0
    }

    // RainVM Script
    const scriptVM: StateConfig = {
      constants: constants,
      sources: [
        concat([
          op(TokenOpsOpcode.VAL, 0),
          op(TokenOpsOpcode.VAL, 1),
          op(TokenOpsOpcode.IERC20_BALANCE_OF),
        ])
      ],
      stackLength: 3,
      argumentsLength: 0
    }

    // JSVM run
    const rainJs = new RainJS(scriptJSVM, { signer: account });
    const resultJSVM = await rainJs.run();
    const expected = BigNumber.from("1000000000000000000000000000");

    // RainVM run
    const tokenOpsFactory = await ethers.getContractFactory("TokenOpsTest");
    const tokenOps = (await tokenOpsFactory.deploy(scriptVM)) as TokenOpsTest & Contract;
    const resultVM = await tokenOps.run();

    // Asserting 
    assert(
      expected.eq(resultJSVM),
      `
       The IERC20_BALANCE_OF operation failed:
       expected ${expected}
       got ${resultJSVM}`
    );

    // RainVM vs JSVM
    assert(
      resultJSVM.eq(resultVM),
      `
       JSVM results mismatched with RainVM:
       expected ${resultVM}
       got ${resultJSVM}`
    );
  });

  it('should return the balnce of an ERC721 token', async () => {

    // Deploying and minting tokens
    const signers = await ethers.getSigners();
    let account = signers[0];
    let account2 = signers[1];
    
    const rTKN = await deployErc721(account);
    await rTKN.deployed();
    await rTKN.connect(account2).mintNewToken();
    await rTKN.connect(account2).mintNewToken();

    // Generating script
    const constants = [
      rTKN.address,
      BigNumber.from(await account2.getAddress())
    ];

    // JSVM Script
    const scriptJSVM: StateConfig = {
      constants: constants,
      sources: [
        concat([
          op(RainJS.Opcodes.VAL, 0),
          op(RainJS.Opcodes.SENDER),
          op(RainJS.Opcodes.IERC721_BALANCE_OF),
        ])
      ],
      stackLength: 3,
      argumentsLength: 0
    }

    // RainVM Script
    const scriptVM: StateConfig = {
      constants: constants,
      sources: [
        concat([
          op(TokenOpsOpcode.VAL, 0),
          op(TokenOpsOpcode.VAL, 1),
          op(TokenOpsOpcode.IERC721_BALANCE_OF),
        ])
      ],
      stackLength: 3,
      argumentsLength: 0
    }

    // JSVM run
    const rainJs = new RainJS(scriptJSVM, { signer: account2 });
    const resultJSVM = await rainJs.run();
    const expected = BigNumber.from("2");

    // RainVM run
    const tokenOpsFactory = await ethers.getContractFactory("TokenOpsTest");
    const tokenOps = (await tokenOpsFactory.deploy(scriptVM)) as TokenOpsTest & Contract;
    const resultVM = await tokenOps.run();

    // Asserting 
    assert(
      expected.eq(resultJSVM),
      `
       The IERC721_BALANCE_OF operation failed:
       expected ${expected}
       got ${resultJSVM}`
    );

    // RainVM vs JSVM
    assert(
      resultJSVM.eq(resultVM),
      `
       JSVM results mismatched with RainVM:
       expected ${resultVM}
       got ${resultJSVM}`
    );
  });
  
  it('should return the balnce of an ERC1155 token', async () => {

    // Deploying and minting tokens
    const signers = await ethers.getSigners();
    let account = signers[0];
    let account2 = signers[1];
    
    const rTKN = await deployErc1155(account);
    await rTKN.deployed();
    await rTKN.connect(account2).mintNewToken();
    // Generating script
    const constants = [
      rTKN.address,
      BigNumber.from(await account2.getAddress()),
      1
    ];

    // JSVM Script
    const scriptJSVM: StateConfig = {
      constants: constants,
      sources: [
        concat([
          op(RainJS.Opcodes.VAL, 0),
          op(RainJS.Opcodes.SENDER),
          op(RainJS.Opcodes.VAL, 2),
          op(RainJS.Opcodes.IERC1155_BALANCE_OF),
        ])
      ],
      stackLength: 3,
      argumentsLength: 0
    }

    // RainVM Script
    const scriptVM: StateConfig = {
      constants: constants,
      sources: [
        concat([
          op(TokenOpsOpcode.VAL, 0),
          op(TokenOpsOpcode.VAL, 1),
          op(RainJS.Opcodes.VAL, 2),
          op(TokenOpsOpcode.IERC1155_BALANCE_OF),
        ])
      ],
      stackLength: 3,
      argumentsLength: 0
    }

    // JSVM run
    const rainJs = new RainJS(scriptJSVM, { signer: account2 });
    const resultJSVM = await rainJs.run();
    const expected = BigNumber.from("1000000000000000");

    // RainVM run
    const tokenOpsFactory = await ethers.getContractFactory("TokenOpsTest");
    const tokenOps = (await tokenOpsFactory.deploy(scriptVM)) as TokenOpsTest & Contract;
    const resultVM = await tokenOps.run();

    // Asserting 
    assert(
      expected.eq(resultJSVM),
      `
       The IERC1155_BALANCE_OF operation failed:
       expected ${expected}
       got ${resultJSVM}`
    );

    // RainVM vs JSVM
    assert(
      resultJSVM.eq(resultVM),
      `
       JSVM results mismatched with RainVM:
       expected ${resultVM}
       got ${resultJSVM}`
    );
  });

  it('should give the minimum value among the values', async () => {

    // Generating script
    const constants = [10, 20, 30, 40, 50, 60];

    // JSVM Script
    const scriptJSVM: StateConfig = {
      constants: constants,
      sources: [
        concat([
          op(RainJS.Opcodes.VAL, 0),
          op(RainJS.Opcodes.VAL, 1),
          op(RainJS.Opcodes.VAL, 2),
          op(RainJS.Opcodes.VAL, 3),
          op(RainJS.Opcodes.VAL, 4),
          op(RainJS.Opcodes.MIN, 5),
        ])
      ],
      stackLength: 6,
      argumentsLength: 0
    }

    // RainVM Script
    const scriptVM: StateConfig = {
      constants: constants,
      sources: [
        concat([
          op(RainVMOpcode.VAL, 0),
          op(RainVMOpcode.VAL, 1),
          op(RainVMOpcode.VAL, 2),
          op(RainVMOpcode.VAL, 3),
          op(RainVMOpcode.VAL, 4),
          op(RainVMOpcode.MIN, 5),
        ])
      ],
      stackLength: 6,
      argumentsLength: 0
    }

    // JSVM run
    const rainJs = new RainJS(scriptJSVM);
    const resultJSVM = await rainJs.run();
    const expected = BigNumber.from("10");


    // RainVM run
    const calculatorFactory = await ethers.getContractFactory("CalculatorTest");
    const calculator = (await calculatorFactory.deploy(scriptVM)) as CalculatorTest & Contract;
    const resultVM = await calculator.run();

    // Asserting 
    assert(
      expected.eq(resultJSVM),
      `
       The MIN operation failed:
       expected ${expected}
       got ${resultJSVM}`
    );

    // RainVM vs JSVM
    assert(
      resultJSVM.eq(resultVM),
      `
       JSVM results mismatched with RainVM:
       expected ${resultVM}
       got ${resultJSVM}`
    );
  });
  
  it('should give the maximum value among the values', async () => {

    // Generating script
    const constants = [10, 20, 30, 40, 50, 60];

    // JSVM Script
    const scriptJSVM: StateConfig = {
      constants: constants,
      sources: [
        concat([
          op(RainJS.Opcodes.VAL, 0),
          op(RainJS.Opcodes.VAL, 1),
          op(RainJS.Opcodes.VAL, 2),
          op(RainJS.Opcodes.VAL, 3),
          op(RainJS.Opcodes.VAL, 4),
          op(RainJS.Opcodes.VAL, 5),
          op(RainJS.Opcodes.MAX, 6),
        ])
      ],
      stackLength: 7,
      argumentsLength: 0
    }

    // RainVM Script
    const scriptVM: StateConfig = {
      constants: constants,
      sources: [
        concat([
          op(RainVMOpcode.VAL, 0),
          op(RainVMOpcode.VAL, 1),
          op(RainVMOpcode.VAL, 2),
          op(RainVMOpcode.VAL, 3),
          op(RainVMOpcode.VAL, 4),
          op(RainVMOpcode.VAL, 5),
          op(RainVMOpcode.MAX, 6),
        ])
      ],
      stackLength: 7,
      argumentsLength: 0
    }

    // JSVM run
    const rainJs = new RainJS(scriptJSVM);
    const resultJSVM = await rainJs.run();
    const expected = BigNumber.from("60");


    // RainVM run
    const calculatorFactory = await ethers.getContractFactory("CalculatorTest");
    const calculator = (await calculatorFactory.deploy(scriptVM)) as CalculatorTest & Contract;
    const resultVM = await calculator.run();

    // Asserting 
    assert(
      expected.eq(resultJSVM),
      `
       The MAX operation failed:
       expected ${expected}
       got ${resultJSVM}`
    );

    // RainVM vs JSVM
    assert(
      resultJSVM.eq(resultVM),
      `
       JSVM results mismatched with RainVM:
       expected ${resultVM}
       got ${resultJSVM}`
    );
  });


});

