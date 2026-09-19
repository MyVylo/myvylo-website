// Native Activity capture supplies the real toolbar/search/filter/navigation
// pixels. Only fictional demo values and repeated transaction rows are layered
// for animation. Row geometry/type/colour comes from ActivityView.swift,
// SignedInTransactionRow (SurfaceChrome.swift) and DesignTokens.swift.
import { money } from '../src/data/hero-demo.js';
const escape = text => text.replaceAll('&','&amp;').replaceAll('<','&lt;');
export function nativeActivity(demo) {
  const row = (tx, i, incoming) => `<div class="native-transaction" ${incoming ? `data-native-row="${i}" style="order:${3-i}"` : 'style="order:10"'}><div class="native-row-inner"><span class="native-avatar">${tx.initials || tx.merchant.slice(0,2).toUpperCase()}</span><div class="native-merchant">${escape(tx.merchant)}</div><strong class="native-amount">${money(tx.amount)}</strong><div class="native-account">${demo.account} · 1082</div><span class="native-category" ${incoming ? `data-native-category="${i}"` : ''}>${escape(tx.category)} <i>⌄</i></span></div></div>`;
  return `<div class="native-activity" data-product-source="ActivityView.swift + native capture"><div class="native-capture"></div><span class="native-total" data-story-value="expenses" data-story-format="full"></span><span class="native-count" data-story-count></span><div class="native-ledger"><p class="native-count-label"><span data-story-count>0</span> <span data-native-count-word>transactions</span></p><div class="native-date">FRIDAY, SEP 18</div><div class="native-rows">${demo.transactions.slice(0,4).map((tx,i)=>row(tx,i,true)).join('')}${demo.history.slice(0,2).map((tx,i)=>row(tx,i,false)).join('')}</div></div><div class="native-bottom-nav"></div></div>`;
}
