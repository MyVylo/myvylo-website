// Build-time data adapters only. TransactionsScreen and every visual component
// are imported unchanged from the product; no application API is called.
let fixture;
const noop = () => {};
export const setHeroFixture = value => { fixture = value; };
export const useMonthScopedDashboardData = () => ({
  expenses: fixture.transactions, categories: fixture.categories,
  setSummary: noop, isDashboardMonthHydrating: false,
  fetchSummary: noop, fetchIncome: noop, fetchDashboardData: noop,
});
export const usePaginatedTransactions = () => ({
  transactions: fixture.transactions, setTransactions: noop,
  loadingInitial: false, loadingMore: false, error: null, hasMore: false,
  refreshVersion: 0, refresh: noop, loadMore: noop,
});
export const useTransactionMonthOverview = () => ({
  monthOverview: { totalSpend: fixture.state.expenses / 100, count: fixture.transactions.length, transactions: fixture.transactions },
  review: { needsReview: 0, queueIds: [] }, reviewFailed: false, overviewFailed: false,
  retryReview: noop, updateMonthTransactions: noop,
});
export const useDashboardDataLifecycle = () => ({ initialDataLoaded: true, showAppLoadingScreen: false });
export const useBankSync = () => ({
  loading: false, bankStatus: { connected: true }, manualSyncInFlight: false,
  manualSyncRemainingMinutes: 0, handleManualSyncCooldownTap: noop,
  fetchConnectedAccounts: noop, fetchBankStatus: noop, connectBank: noop, syncTransactions: noop,
});
