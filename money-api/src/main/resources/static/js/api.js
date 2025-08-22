// API abstraction (stubbed)
export const api = {
  baseUrl: '/api',
  async listTransactions(){
    return [
      { id: 501, date: '2025-08-01', account: 'AIB', category:'Expense', amount: -35.90, note:'Groceries' },
      { id: 502, date: '2025-08-03', account: 'IBKR', category:'Trade', amount: -2000.00, note:'AAPL BUY' },
      { id: 503, date: '2025-08-10', account: 'AIB', category:'Income', amount: 2900.00, note:'Salary' },
    ];
  },
  async listPortfolios(){
    return [
      { id: 'P-001', name:'Core', value: 25670.12, pnl: +4.2 },
      { id:'P-002', name:'Growth', value: 11890.33, pnl: -1.1 }
    ];
  },
  // TODO real fetch examples:
  // async fetchPositions(){ return fetch(`${this.baseUrl}/portfolio`).then(r=>r.json()); }
};