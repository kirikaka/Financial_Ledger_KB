<template>
  <div class="modal-backdrop">
    <div class="modal">
      <h1 class="header-title">
        <span style="color: #F2BB13;">{{ memberName }}</span>의 거래 내역
      </h1>
      <h2 class="subtitle">거래 내역 상세 페이지</h2>

      <label>
        수입/지출
        <select v-model="transactionType">
          <option value="income">수입</option>
          <option value="outcome">지출</option>
        </select>
      </label>

      <label>
        날짜
        <input v-model="edited.date" type="date" />
      </label>

      <label>
        금액
        <input v-model.number="edited.expense" type="number" />
      </label>

      <label>
        분류
        <select v-model="edited.category">
          <optgroup v-if="transactionType === 'income'" label="수입">
              <option value="월급">월급</option>
              <option value="부수입">부수입</option>
              <option value="용돈">용돈</option>
              <option value="금융소득">금융소득</option>
              <option value="기타">기타</option>
            </optgroup>
            <optgroup v-if="transactionType === 'outcome'" label="지출">
              <option value="식비">식비</option>
              <option value="교통">교통</option>
              <option value="문화생활">문화생활</option>
              <option value="생활비">생활비</option>
              <option value="패션">패션</option>
              <option value="기타">기타</option>
            </optgroup>
        </select>
      </label>

      <label>
        메모
        <input v-model="edited.memo" type="text" />
      </label>

      <div class="modal-buttons">
        <button class="btn1" @click="$emit('close')">취소</button>
        <button class="btn1" @click="save">저장</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    data: Object,
  },
  data() {
    return {
      edited: { ...this.data },
      transactionType: this.data.income ? 'income' : 'outcome',
      memberName: '',
      incomeCategories: ['월급', '부수입', '용돈', '금융소득', '기타'],
      outcomeCategories: ['식비', '교통', '문화생활', '생활비', '패션', '기타'],
    };
  },
  computed: {
    categoryOptions() {
      return this.transactionType === 'income'
        ? this.incomeCategories
        : this.outcomeCategories;
    },
  },
  created() {
    this.fetchMemberName();
  },
  methods: {
    async fetchMemberName() {
      try {
        const response = await fetch(`http://localhost:3000/members/${this.data.userId}`);
        const result = await response.json();
        this.memberName = result.name;
      } catch (error) {
        console.error('이름을 불러오는 중 오류 발생:', error);
      }
    },
    save() {
      this.edited.income = this.transactionType === 'income';
      this.edited.outcome = this.transactionType === 'outcome';
      this.$emit('save', this.edited);
    },
  },
};
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.4);
  z-index: 9999;
  display: flex;
  justify-content: center;
  align-items: center;
}
.modal {
  background: #FFF3C7;
  padding: 2rem;
  border-radius: 8px;
  min-width: 300px;
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
.btn1 {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  background-color: #f2bb13;
  color: #000;
}
</style>