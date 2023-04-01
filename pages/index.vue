

<template>
  <el-card class="w-full h-full flex justify-center items-center">
    <el-form
      ref="ruleFormRef"
      class="max-w-[800px]"
      :model="ruleForm"
      :rules="rules"
      status-icon
    >
      <el-form-item label="Email" prop="email" >
        <el-input v-model="ruleForm.email" type="email"/>
      </el-form-item>

      <el-form-item label="Password" prop="password">
        <el-input type="password" v-model="ruleForm.password"/>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="submitForm">
          Login
        </el-button>
        <el-button @click="resetForm">Reset</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script lang="ts" setup>
const {$routeNames} = useNuxtApp()
definePageMeta({
  pageLabel: 'Login',
  navOrder: 1
})
const options = Array.from({ length: 10 }).map((_, idx) => ({
  value: `${idx + 1}`,
  label: `${idx + 1}`
}))
const ruleFormRef = useElFormRef()
const ruleForm = useElFormModel({
  email: '',
  password: '',
})
const rules = useElFormRules({
  email: [useRequiredRule(),{
          type: 'email',
          message: 'Incorrect email',
          trigger: ['blur', 'change'],
        }],
  password:[useMinLenRule(6), useRequiredRule()]
  
})
async function submitForm () {
  await ruleFormRef.value.validate((valid, fields) => {
    if (valid) {
      useRouter().push({name:$routeNames.game})
    } else {
      console.log('error submit!', fields)
    }
  })
}
function resetForm () {
  ruleFormRef.value.resetFields()
}
</script>