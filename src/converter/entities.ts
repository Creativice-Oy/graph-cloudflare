import { CloudflareObject } from '../collector';
import {
  createIntegrationEntity,
  getTime,
  convertProperties,
} from '@jupiterone/integration-sdk';

export const convertAccount = (
  data: CloudflareObject,
): ReturnType<typeof createIntegrationEntity> =>
  createIntegrationEntity({
    entityData: {
      source: data,
      assign: {
        _key: `cloudflare_account:${data.id}`,
        _type: 'cloudflare_account',
        _class: ['Account'],
        id: data.id,
        accountId: data.id,
        name: data.name,
        displayName: data.name,
        type: data.type,
        mfaEnabled: data.settings?.enforce_twofactor || undefined,
        mfaEnforced: data.settings?.enforce_twofactor,
        accessApprovalExpiry: data.settings?.access_approval_expiry,
        createdOn: getTime(data.created_on),
      },
    },
  });

export const convertAccountMember = (
  data: CloudflareObject,
): ReturnType<typeof createIntegrationEntity> =>
  createIntegrationEntity({
    entityData: {
      source: data,
      assign: {
        _key: `cloudflare_account_member:${data.id}`,
        _type: 'cloudflare_account_member',
        _class: ['User'],
        id: data.user.id || data.id,
        userId: data.user.id,
        membershipId: data.id,
        firstName: data.user.first_name,
        lastName: data.user.last_name,
        name:
          data.user.first_name && data.user.last_name
            ? `${data.user.first_name} ${data.user.first_name}`
            : '',
        username: data.user.email,
        email: data.user.email,
        displayName: data.user.email as string,
        mfaEnabled: data.user.two_factor_authentication_enabled,
        createdOn: getTime(data.created_on),
        status: data.status,
        active: data.status === 'accepted',
        roles: data.roles.map((role) => role.id),
        admin: !!data.roles.find(
          (role) =>
            typeof role.name === 'string' && role.name.match(/administrator/i),
        ),
        superAdmin: !!data.roles.find(
          (role) =>
            typeof role.name === 'string' && role.name.match(/super admin/i),
        ),
      },
    },
  });

export const convertAccountRole = (
  data: CloudflareObject,
): ReturnType<typeof createIntegrationEntity> =>
  createIntegrationEntity({
    entityData: {
      source: data,
      assign: {
        _key: `cloudflare_account_role:${data.id}`,
        _type: 'cloudflare_account_role',
        _class: ['AccessRole'],
        id: data.id,
        roleId: data.id,
        name: data.name,
        displayName: data.name,
        description: data.description,
      },
    },
  });

export const convertZone = (
  data: CloudflareObject,
): ReturnType<typeof createIntegrationEntity> =>
  createIntegrationEntity({
    entityData: {
      source: data,
      assign: {
        ...convertProperties(data),
        ...convertProperties(data.meta),
        _key: `cloudflare_dns_zone:${data.id}`,
        _type: 'cloudflare_dns_zone',
        _class: ['DomainZone'],
        id: data.id,
        displayName: data.name,
        domainName: data.name,
        active: data.status === 'active',
        ownerId: data.owner?.id,
        ownerType: data.owner?.type,
        ownerEmail: data.owner?.email,
        accountId: data.account?.id,
        accountName: data.account?.name,
        activatedOn: getTime(data.activated_on),
        createdOn: getTime(data.created_on),
        modifiedOn: getTime(data.modified_on),
        owner: undefined,
      },
    },
  });

export const convertRecord = (
  data: CloudflareObject,
): ReturnType<typeof createIntegrationEntity> =>
  createIntegrationEntity({
    entityData: {
      source: data,
      assign: {
        ...convertProperties(data),
        ...convertProperties(data.meta),
        _key: `cloudflare_dns_record:${data.id}`,
        _type: 'cloudflare_dns_record',
        _class: ['DomainRecord'],
        displayName: data.name,
        createdOn: getTime(data.created_on),
        modifiedOn: getTime(data.modified_on),
        TTL: data.ttl || 0,
      },
    },
  });
