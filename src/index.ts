import { IntegrationInvocationConfig } from '@jupiterone/integration-sdk';

import instanceConfigFields from './instanceConfigFields';
import validateInvocation from './validateInvocation';

import fetchAccounts from './steps/fetch-accounts';
import fetchZones from './steps/fetch-zones';

export const invocationConfig: IntegrationInvocationConfig = {
  instanceConfigFields,
  validateInvocation,
  integrationSteps: [fetchAccounts, fetchZones],
};
