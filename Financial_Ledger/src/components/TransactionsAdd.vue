<template>
  <div class="modal-backdrop">
    <div class="modal">
      <h1 class="header-title">
        <span style="color: #F2BB13;">{{ memberName }}</span>의 거래 내역
      </h1>
      <h2 class="subtitle">빠른 거래 추가</h2>

      <label>
        수입/지출
        <select v-model="transactionType">
          <option value="income">수입</option>
          <option value="outcome">지출</option>
        </select>
      </label>

      <label>
        날짜
        <input v-model="form.date" type="date" />
      </label>

      <label>
        금액
        <input v-model.number="form.expense" type="number" />
      </label>

      <label>
        분류
        <select v-model="form.category">
          <optgroup label="수입">
            <option value="월급">월급</option>
            <option value="용돈">용돈</option>
            <option value="기타">기타</option>
          </optgroup>
          <optgroup label="지출">
            <option value="식비">식비</option>
            <option value="교통비">교통비</option>
            <option value="기타">기타</option>
          </optgroup>
        </select>
      </label>

      <label>
        메모
        <input v-model="form.memo" type="text" />
      </label>

      <div class="modal-buttons">
        <button class="btn cancel" @click="$emit('close')">닫기</button>
        <button class="btn submit" @click="addTransaction">추가</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['userId'],
  data() {
    return {
      transactionType: 'income',
      // 사용자 지정해둠 로그인 구현 완료 후 진행
      form: {
        userId: '',
        date: '',
        expense: 0,
        category: '',
        memo: '',
      },
      memberName: '',
    };
  },
  created() {
    this.form.userId = this.userId;
    this.fetchMemberName();
  },
  methods: {
    async fetchMemberName() {
      try {
        const response = await fetch(`http://localhost:3000/members/${this.form.userId}`);
        const result = await response.json();
        this.memberName = result.name;
      } catch (error) {
        console.error('이름을 불러오는 중 오류 발생:', error);
      }
    },
    addTransaction() {
      const newTransaction = {
        ...this.form,
        income: this.transactionType === 'income',
        outcome: this.transactionType === 'outcome',
      };

      fetch('http://localhost:3000/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTransaction),
      })
        .then((res) => res.json())
        .then((data) => {
          this.$emit('added', data); // 부모에게 성공 알림
          this.$emit('close'); // 모달 닫기
        })
        .catch((err) => console.error('추가 실패:', err));
    },
  },
};
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  z-index: 9999;
  display: flex;
  justify-content: center;
  align-items: center;
}
.modal {
  background: #fff3c7;
  padding: 2rem;
  border-radius: 8px;
  width: 700px;
  height: 600px;
}
.title, .subtitle {
  text-align: center;
}
.modal label {
  display: block;
  margin-bottom: 1rem;
}
.modal input,
.modal select {
  width: 100%;
  padding: 0.5rem;
  margin-top: 0.3rem;
}
.modal-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1rem;
}
.btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
}
.btn.submit {
  background-color: #f2bb13;
  color: #000;
}
.btn.cancel {
  background-color: #f2bb13;
  color: #000;
}
</style>
