import { SessionKey } from '@companieshouse/node-session-handler/lib/session/keys/SessionKey';
import { SignInInfoKeys } from '@companieshouse/node-session-handler/lib/session/keys/SignInInfoKeys';
import { UserProfileKeys } from '@companieshouse/node-session-handler//lib/session/keys/UserProfileKeys';
import { ISignInInfo } from '@companieshouse/node-session-handler/lib/session/model/SessionInterfaces';
import { AccessTokenKeys } from '@companieshouse/node-session-handler/lib/session/keys/AccessTokenKeys';

const getSignInInfo = (session): ISignInInfo => {
  return session?.data?.[SessionKey.SignInInfo];
};

export const getLoggedInUserEmail = (session): string => {
  const signInInfo = getSignInInfo(session);
  return signInInfo?.[SignInInfoKeys.UserProfile]?.[UserProfileKeys.Email] as string;
};

export const checkUserSignedIn = (session): boolean => {
  const signInInfo = getSignInInfo(session);
  return signInInfo?.[SignInInfoKeys.SignedIn] === 1;
};

export const getAccessToken = (session): string => {
  const signInInfo = getSignInInfo(session);
  return signInInfo?.[SignInInfoKeys.AccessToken]?.[AccessTokenKeys.AccessToken] as string;
};
