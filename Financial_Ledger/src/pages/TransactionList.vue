<template>
    <div class="container">
      <div class="sidebar">
        <div class="profile">
          <h2>금쪽이</h2>
        </div>
        <div>
          <div class="sidebar-nav">
            <button class="moveTL-btn">최근 거래 내역 확인</button>
            <button @click="showAddModal = true" class="add-asset-btn">빠른 거래 추가</button>
            <div class="balance-summary">
              <p>수입: {{ incomeTotalFormatted }}</p>
              <p>지출: {{ expenseTotalFormatted }}</p>
              <p>순이익: {{ netProfitFormatted }}</p>
            </div>
          </div>
        </div>
        <button class="logout-btn">Logout</button>
      </div>
  
      <div class="main-content">
        <h1 class="header-title">{{ currentUser.name }}의 거래 내역</h1>
  
        <div class="summary-cards">
          <div class="summary-card">
            <span>수입</span>
            <strong class="income">{{ incomeTotalFormatted }}</strong>
          </div>
          <div class="summary-card">
            <span>지출</span>
            <strong class="outcome">{{ expenseTotalFormatted }}</strong>
          </div>
          <div class="summary-card">
            <span>순이익</span>
            <strong class="profit">{{ netProfitFormatted }}</strong>
          </div>
        </div>
  
        <div class="header-controls">
          <div class="month-selector">
            <button class="month-btn" @click="prevMonth">&lt;</button>
            <span class="month-display">{{ monthDisplay }}</span>
            <button class="month-btn" @click="nextMonth">&gt;</button>
          </div>
        </div>
  
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
              <td
                :class="{
                  income: transaction.type === '수입',
                  outcome: transaction.type === '지출',
                }"
              
              >{{ transaction.type }}
              </td>
              <td>{{ transaction.date }}</td>
              <td>{{ formatCurrency(transaction.expense) }}</td>
              <td>
                <button class="action-btn" @click="editTransaction(transaction)">
                  상세
                </button>
                <button
                  class="action-btn"
                  @click="deleteTransaction(transaction)"
                >
                  삭제
                </button>
              </td>
            </tr>
          </tbody>
        </table>
        <DetailPageEdit
          v-if="isModalVisible"
          :data="selectedItem"
          @close="isModalVisible = false"
          @save="saveTransaction"
        />
        <TransactionsAdd
          v-if="showAddModal"
          :user-id="currentUserId"
          @close="showAddModal = false"
          @added="fetchTransactions"
        />

        <button class="load-more-btn" @click="loadMore">Load More</button>
      </div>
    </div>
  </template>
  
  <script>
  import '../assets/TL.css';
  import DetailPageEdit from '@/components/DetailPageEdit.vue';
  import TransactionsAdd from '@/components/TransactionsAdd.vue';
  
  export default {
    name: 'TransactionList',
    components: { DetailPageEdit, TransactionsAdd },
    data() {
      return {
        currentUserId: '5678',
        currentUser: {},
        transactions: [],
        activeTab: '전체',
        currentDate: new Date(2025, 3, 1),
        showAddModal: false, 
        selectedItem: null, 
        isModalVisible: false,
      };
    },
    mounted() {
      fetch(`http://localhost:3000/members/${this.currentUserId}`)
        .then((res) => res.json())
        .then((user) => {
          this.currentUser = user;
        })
        .catch((err) => console.error(err));

      this.fetchTransactions();

      fetch('http://localhost:3000/transactions')
        .then((res) => res.json())
        .then((data) => {
        this.transactions = data;
        })  
  
      fetch(`http://localhost:3000/transactions?userId=${this.currentUserId}`)
        .then((res) => res.json())
        .then((transactions) => {
          this.transactions = transactions;
        })
        .catch((err) => console.error(err));

        
    },
    computed: {
      userTransactions() {
        return this.transactions
          .filter((txn) => txn.userId === this.currentUserId)
          .map((txn) => {
            if (txn.income && !txn.outcome) {
              txn.type = '수입';
            } else if (!txn.income && txn.outcome) {
              txn.type = '지출';
            } else {
              txn.type = '알 수 없음';
            }
            return txn;
          });
      },
      filteredTransactions() {
        const currentYear = this.currentDate.getFullYear();
        const currentMonth = this.currentDate.getMonth();
        let trans = this.userTransactions.filter((txn) => {
          const txnDate = new Date(txn.date);
          return (
            txnDate.getFullYear() === currentYear &&
            txnDate.getMonth() === currentMonth
          );
        });
        if (this.activeTab !== '전체') {
          trans = trans.filter((txn) => txn.type === this.activeTab);
        }
        return trans;
      },
      monthDisplay() {
        const monthNames = [
          'JAN',
          'FEB',
          'MAR',
          'APR',
          'MAY',
          'JUN',
          'JUL',
          'AUG',
          'SEP',
          'OCT',
          'NOV',
          'DEC',
        ];
        const d = this.currentDate;
        return `${monthNames[d.getMonth()]} ${d.getFullYear()}`;
      },
      incomeTotal() {
        return this.userTransactions
          .filter((txn) => txn.type === '수입')
          .reduce((acc, txn) => acc + txn.expense, 0);
      },
      expenseTotal() {
        return this.userTransactions
          .filter((txn) => txn.type === '지출')
          .reduce((acc, txn) => acc + txn.expense, 0);
      },
      netProfit() {
        return this.incomeTotal - this.expenseTotal;
      },
      incomeTotalFormatted() {
        return this.formatCurrency(this.incomeTotal);
      },
      expenseTotalFormatted() {
        return this.formatCurrency(this.expenseTotal);
      },
      netProfitFormatted() {
        return this.formatCurrency(this.netProfit);
      },
    },
    methods: {
      editTransaction(transaction) {
        this.openModal(transaction);
      },
      openModal(transaction) {
        this.selectedItem = { ...transaction };
        this.isModalVisible = true;
      },
      deleteTransaction(transaction) {
        fetch(`http://localhost:3000/transactions/${transaction.id}`, {
          method: 'DELETE',
        })
          .then((response) => {
            if (response.ok) {
              this.transactions = this.transactions.filter(
                (txn) => txn.id !== transaction.id
              );
            } else {
              throw new Error('삭제 실패');
            }
          })
          .catch((err) => console.error(err));
      },
      loadMore() {
        alert('더 많은 거래 내역을 불러옵니다.');
      },
      prevMonth() {
        const d = this.currentDate;
        this.currentDate = new Date(d.getFullYear(), d.getMonth() - 1, 1);
      },
      nextMonth() {
        const d = this.currentDate;
        this.currentDate = new Date(d.getFullYear(), d.getMonth() + 1, 1);
      },
      formatCurrency(amount) {
        return Number(amount).toLocaleString();
      },
      openModal(transaction) {
      this.selectedItem = { ...transaction };
      this.isModalVisible = true;
      },
      saveTransaction(updatedItem) {
        const index = this.transactions.findIndex((t) => t.id === updatedItem.id);
        if (index !== -1) {
          this.transactions.splice(index, 1, updatedItem);
        }
        this.isModalVisible = false;

      // 실제 db.json에 반영하려면 PATCH 요청 필요
      fetch(`http://localhost:3000/transactions/${updatedItem.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedItem),
      });
      },
      fetchTransactions() {
        fetch(`http://localhost:3000/transactions?userId=${this.currentUserId}`)
          .then(res => res.json())
          .then(data => {
            this.transactions = data;
          })
          .catch(err => console.error(err));
      }

    },
  };
  </script>
  