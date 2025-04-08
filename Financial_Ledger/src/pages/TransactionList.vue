<template>
  <div class="container">
    <!-- 왼쪽 사이드바 -->
    <div class="sidebar">
      <div>
        <h2>금쪽이</h2>
        <div class="sidebar-nav">
          <button class="add-asset-btn">배분 자산 추가</button>
          <div class="balance-summary">
            <p>수입: +700,000</p>
            <p>지출: -700,000</p>
            <p>순이익: -200,000</p>
          </div>
        </div>
      </div>
      <button class="logout-btn">Logout</button>
    </div>

    <!-- 메인 컨텐츠 영역 -->
    <div class="main-content">
      <h1 class="header-title">이호진의 거래 내역</h1>

      <!-- 수입/지출/순이익 카드 -->
      <div class="summary-cards">
        <div class="summary-card">
          <span>수입</span>
          <strong>{{ incomeTotal }}</strong>
        </div>
        <div class="summary-card">
          <span>지출</span>
          <strong>{{ expenseTotal }}</strong>
        </div>
        <div class="summary-card">
          <span>순이익</span>
          <strong>{{ netProfit }}</strong>
        </div>
      </div>

      <!-- 탭 버튼 -->
      <div class="tabs">
        <button
          class="tab-btn"
          :class="{ active: activeTab === '전체' }"
          @click="activeTab = '전체'"
        >
          전체
        </button>
        <button
          class="tab-btn"
          :class="{ active: activeTab === '수입' }"
          @click="activeTab = '수입'"
        >
          수입
        </button>
        <button
          class="tab-btn"
          :class="{ active: activeTab === '지출' }"
          @click="activeTab = '지출'"
        >
          지출
        </button>
      </div>

      <!-- 거래 내역 테이블 -->
      <table class="transaction-table">
        <thead>
          <tr>
            <th>수입/지출</th>
            <th>날짜</th>
            <th>금액</th>
            <th>기능</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="transaction in filteredTransactions" :key="transaction.id">
            <td>{{ transaction.type }}</td>
            <td>{{ transaction.date }}</td>
            <td>{{ transaction.amount }}</td>
            <td>
              <button class="action-btn" @click="editTransaction(transaction)">
                수정
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Load More 버튼 -->
      <button class="load-more-btn" @click="loadMore">Load More</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TransactionList',
  data() {
    return {
      activeTab: '전체',
      transactions: [
        { id: 1, type: '수입', date: '17 May, 2023', amount: '$10.00' },
        { id: 2, type: '지출', date: '17 May, 2023', amount: '$20.00' },
        { id: 3, type: '지출', date: '17 May, 2023', amount: '$25.00' },
        { id: 4, type: '수입', date: '17 May, 2023', amount: '$15.00' },
        { id: 5, type: '수입', date: '17 May, 2023', amount: '$30.00' },
      ],
    };
  },
  computed: {
    filteredTransactions() {
      // '전체' 탭일 경우 전체 데이터 반환, 아니면 타입별 필터링
      return this.activeTab === '전체'
        ? this.transactions
        : this.transactions.filter((txn) => txn.type === this.activeTab);
    },
    incomeTotal() {
      const total = this.transactions.reduce((acc, txn) => {
        if (txn.type === '수입') {
          return acc + parseFloat(txn.amount.replace('$', ''));
        }
        return acc;
      }, 0);
      return '$' + total.toFixed(2);
    },
    expenseTotal() {
      const total = this.transactions.reduce((acc, txn) => {
        if (txn.type === '지출') {
          return acc + parseFloat(txn.amount.replace('$', ''));
        }
        return acc;
      }, 0);
      return '$' + total.toFixed(2);
    },
    netProfit() {
      const income = parseFloat(this.incomeTotal.replace('$', ''));
      const expense = parseFloat(this.expenseTotal.replace('$', ''));
      const net = income - expense;
      return '$' + net.toFixed(2);
    },
  },
  methods: {
    editTransaction(transaction) {
      // 거래 수정 기능 처리 (필요 시 라우팅 또는 모달 등을 띄울 수 있음)
      alert('수정 기능: ' + JSON.stringify(transaction));
    },
    loadMore() {
      // 추가 거래 내역을 불러오는 로직 (예시: API 호출)
      alert('더 많은 거래 내역을 불러옵니다.');
    },
  },
};
</script>

<style scoped>
/* 기본 초기화 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
.container {
  display: flex;
  min-height: 100vh;
}

/* 사이드바 스타일 */
.sidebar {
  width: 280px;
  background-color: #2c2c2c;
  color: #fff;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 2rem;
}

.sidebar h2 {
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  font-weight: 700;
}

.sidebar-nav {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.add-asset-btn {
  background-color: #f0c545;
  color: #2c2c2c;
  border: none;
  padding: 0.75rem 1rem;
  border-radius: 4px;
  font-weight: 600;
}

.balance-summary {
  line-height: 1.8;
}
.balance-summary p {
  font-size: 0.9rem;
}

.logout-btn {
  background-color: transparent;
  color: #fff;
  border: 1px solid #fff;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  font-size: 0.9rem;
  margin-top: 2rem;
  align-self: flex-start;
}

/* 메인 컨텐츠 영역 */
.main-content {
  flex: 1;
  padding: 2rem;
}

.header-title {
  font-size: 1.4rem;
  font-weight: 700;
  margin-bottom: 2rem;
}

/* 요약 카드 */
.summary-cards {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
}
.summary-card {
  flex: 1;
  background-color: #fff;
  border-radius: 4px;
  padding: 1rem;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.06);
  text-align: center;
}
.summary-card span {
  font-size: 0.95rem;
  color: #666;
  display: block;
  margin-bottom: 0.5rem;
}
.summary-card strong {
  font-size: 1.2rem;
  font-weight: 700;
}

/* 탭 버튼 */
.tabs {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
}
.tab-btn {
  background-color: #eee;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  font-size: 0.9rem;
  cursor: pointer;
}
.tab-btn.active {
  background-color: #333;
  color: #fff;
}

/* 거래 내역 테이블 */
.transaction-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 2rem;
  background-color: #fff;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
  border-radius: 4px;
  overflow: hidden;
}

.transaction-table thead {
  background-color: #f0f0f0;
}
.transaction-table thead th {
  font-weight: 600;
  text-align: left;
  padding: 0.75rem;
  font-size: 0.9rem;
}
.transaction-table tbody td {
  padding: 0.75rem;
  font-size: 0.9rem;
  border-bottom: 1px solid #eee;
}
.transaction-table tbody tr:last-child td {
  border-bottom: none;
}

/* 버튼 스타일 */
.action-btn {
  background-color: #ddd;
  border: none;
  padding: 0.4rem 0.8rem;
  border-radius: 4px;
  font-size: 0.8rem;
  cursor: pointer;
}

.load-more-btn {
  background-color: #333;
  color: #fff;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
}

/* 반응형 */
@media screen and (max-width: 768px) {
  .sidebar {
    display: none;
  }
  .main-content {
    padding: 1rem;
  }
  .summary-cards {
    flex-direction: column;
  }
}
</style>
