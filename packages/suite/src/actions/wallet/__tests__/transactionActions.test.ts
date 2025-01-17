import { transactionsReducer } from 'src/reducers/wallet';
import { getAccountTransactions } from '@suite-common/wallet-utils';
import {
    transactionsActions,
    transactionsInitialState,
    TransactionsState,
} from '@suite-common/wallet-core';
import { configureStore } from '@reduxjs/toolkit';
import { settingsCommonConfig } from '@suite-common/suite-config';

const { getWalletTransaction } = global.JestMocks;

const initStore = (transactionsState?: TransactionsState) =>
    configureStore({
        reducer: {
            transactions: transactionsReducer,
        },
        preloadedState: {
            transactions: transactionsState ?? transactionsInitialState,
        },
    });

// TODO: more tests (updating existing/pending txs, fetching the data from blockbook,...)
describe('Transaction Actions', () => {
    it('Add transaction for first page (used on account create)', () => {
        const store = initStore();
        const account = global.JestMocks.getWalletAccount();
        store.dispatch(
            transactionsActions.addTransaction({
                transactions: [getWalletTransaction()],
                account,
                page: 1,
                perPage: settingsCommonConfig.TXS_PER_PAGE,
            }),
        );
        expect(
            getAccountTransactions(account.key, store.getState().transactions.transactions).length,
        ).toEqual(1);
    });

    it('Remove txs for a given account', () => {
        const account1 = global.JestMocks.getWalletAccount({ descriptor: 'xpub1' });
        const account2 = global.JestMocks.getWalletAccount({ descriptor: 'xpub2' });
        const store = initStore({
            transactions: {
                [account1.key]: [getWalletTransaction()],
                [account2.key]: [getWalletTransaction()],
            },
            isLoading: false,
            error: null,
        });

        store.dispatch(transactionsActions.resetTransaction({ account: account1 }));
        // removed txs for acc1
        expect(
            getAccountTransactions(account1.key, store.getState().transactions.transactions),
        ).toEqual([]);
        // txs for acc2 are still there
        expect(
            getAccountTransactions(account2.key, store.getState().transactions.transactions).length,
        ).toEqual(1);
    });
});
