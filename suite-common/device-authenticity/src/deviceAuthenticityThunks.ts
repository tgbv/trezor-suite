import TrezorConnect, { AuthenticateDeviceResult } from '@trezor/connect';
import { createThunk } from '@suite-common/redux-utils';
import { notificationsActions } from '@suite-common/toast-notifications';

import { ACTION_PREFIX, deviceAuthenticityActions } from './deviceAuthenticityActions';

export const checkDeviceAuthenticityThunk = createThunk<
    { allowDebugKeys: boolean; skipSuccessToast?: boolean },
    string | AuthenticateDeviceResult
>(
    `${ACTION_PREFIX}/checkDeviceAuthenticity`,
    async (
        { allowDebugKeys, skipSuccessToast },
        { dispatch, getState, extra, rejectWithValue, fulfillWithValue },
    ) => {
        const {
            selectors: { selectDevice },
        } = extra;
        const device = selectDevice(getState());
        if (!device) {
            throw new Error('device is not connected');
        }

        const result = await TrezorConnect.authenticateDevice({
            device: {
                path: device.path,
            },
            allowDebugKeys,
        });

        if (!result.success) {
            dispatch(
                notificationsActions.addToast({
                    type: 'error',
                    error: `Unable to validate device: ${result.payload.error}`,
                }),
            );
            return rejectWithValue(result.payload.error);
        }

        dispatch(deviceAuthenticityActions.result({ device, result: result.payload }));

        // CA_PUBKEY_NOT_FOUND with configExpired is temporary allowed and just logged to Sentry
        const caPubKeyNotFoundInExpiredConfig =
            result.payload.error === 'CA_PUBKEY_NOT_FOUND' && result.payload.configExpired;

        if (!result.payload.valid && !caPubKeyNotFoundInExpiredConfig) {
            dispatch(
                notificationsActions.addToast({
                    type: 'device-authenticity-error',
                    error: `Device is not authentic: ${result.payload.error}`,
                }),
            );
            console.warn(result.payload.error);
        } else if (!skipSuccessToast) {
            dispatch(notificationsActions.addToast({ type: 'device-authenticity-success' }));
        }

        return fulfillWithValue(result.payload);
    },
);
