import { BigNumber } from '@ethersproject/bignumber';
import { utils } from 'ethers';
import {
  Config,
  RedeemableERC20Config,
  RedeemableERC20PoolConfig,
  TrustConfig,
} from './types';

type ValidationFailure = {
  error: string;
  errorMessage: string;
  properties: string[];
};

type ValidationResult = {
  isValid: boolean;
  errors: ValidationFailure[];
};

export class TrustConfigValidator {
  public async validateTrustConfig(
    config: TrustConfig
  ): Promise<ValidationResult> {
    let isValid = true;
    let errors = [];
    if (!utils.isAddress(config.creator)) {
      isValid = false;
      errors.push(
        this.buildValidationFailure(
          'CREATOR_NOT_ADDRESS',
          "Property 'creator' is not a valid address",
          ['creator']
        )
      );
    }

    return { isValid, errors };
  }

  public async validateRedeemableConfig(
    config: RedeemableERC20Config
  ): Promise<ValidationResult> {
    let isValid = true;
    let errors = [];

    if (!utils.isAddress(config.tier)) {
      isValid = false;
      errors.push(
        this.buildValidationFailure(
          'TIER_NOT_ADDRESS',
          "Property 'tier' is not a valid address",
          ['tier']
        )
      );
    }

    if (
      config.minimumStatus.lt(BigNumber.from(0)) ||
      config.minimumStatus.gt(BigNumber.from(8))
    ) {
      isValid = false;
      errors.push(
        this.buildValidationFailure(
          'MINIMUMSTATUS_NOT_VALID',
          'Tiers values must be between 0 and 8',
          ['minimumStatus']
        )
      );
    }

    return { isValid, errors };
  }

  public async validatePoolConfig(
    config: RedeemableERC20PoolConfig
  ): Promise<ValidationResult> {
    let isValid = true;
    let errors = [];
    if (!utils.isAddress(config.reserve)) {
      isValid = false;
      errors.push(
        this.buildValidationFailure(
          'RESERVE_NOT_ADDRESS',
          "Property 'creator' is not a valid address",
          ['creator']
        )
      );
    }

    if (config.minimumTradingDuration.eq(BigNumber.from(0))) {
      isValid = false;
      errors.push(
        this.buildValidationFailure(
          'MINIMUM_TRADING_DURATION_IS_ZERO',
          'Minimum trading duration cannot be zero',
          ['minimumTradingDuration']
        )
      );
    }

    if (config.initialValuation.lt(config.finalValuation)) {
      isValid = false;
      errors.push(
        this.buildValidationFailure(
          'VALUATION',
          'Initial valuation must be equal to or higher than the final valuation',
          ['initialValuation', 'finalValuation']
        )
      );
    }

    return { isValid, errors };
  }

  public async validate(config: Config): Promise<ValidationResult> {
    const trustValidation = await this.validateTrustConfig(config.trustConfig);
    const redeemableValidation = await this.validateRedeemableConfig(
      config.redeemableERC20Config
    );
    const poolValidation = await this.validatePoolConfig(
      config.redeemableERC20PoolConfig
    );

    return {
      isValid:
        trustValidation.isValid &&
        redeemableValidation.isValid &&
        poolValidation.isValid,
      errors: [
        ...trustValidation.errors,
        ...redeemableValidation.errors,
        ...poolValidation.errors,
      ],
    };
  }

  protected buildValidationFailure(
    error: string,
    errorMessage: string,
    properties: string[]
  ): ValidationFailure {
    return { error, errorMessage, properties };
  }
}
