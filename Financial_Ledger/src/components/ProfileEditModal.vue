<template>
  <div class="modal-backdrop">
    <div class="modal">
      <h1 class="header-title">회원 정보 수정</h1>

      <label>
        이름
        <input v-model="edited.name" type="text" />
      </label>

      <label>
        이메일
        <input v-model="edited.email" type="email" />
      </label>

      <label>
        비밀번호
        <input v-model="edited.password" type="password" />
      </label>

      <div class="modal-buttons">
        <button class="btn1" @click="$emit('close')">취소</button>
        <button class="btn1" @click="save">저장</button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  props: {
    data: Object, // 부모 컴포넌트로부터 전달받은 회원 정보
  },
  data() {
    return {
      edited: { ...this.data }, // 수정 가능한 형태로 복사
    };
  },
  methods: {
    async save() {
      try {
        await axios.patch(`http://localhost:3000/members/${this.edited.id}`, {
          name: this.edited.name,
          email: this.edited.email,
          password: this.edited.password,
        });

        alert('회원 정보가 성공적으로 수정되었습니다!');
        this.$emit('save', this.edited); // 부모에게 저장 완료 알림
        this.$emit('close'); // 모달 닫기
      } catch (error) {
        console.error('회원 정보 수정 실패:', error);
        alert('수정에 실패했습니다. 다시 시도해주세요.');
      }
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
  width: 500px;
}
.header-title {
  text-align: center;
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
}
.modal label {
  display: block;
  margin-bottom: 1rem;
}
.modal input {
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
  font-weight: bold;
  cursor: pointer;
}
</style>
