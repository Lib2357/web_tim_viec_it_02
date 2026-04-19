const MOCK_PROFILE = {
  username: 'nguyenvana',
  email: 'nguyenvana@example.com',
  fullName: 'Nguyen Van A',
  bio: 'Backend developer with product mindset and interest in scalable systems.',
  address: 'TP.HCM',
  phone: '0901234567',
  birthDate: '12/09/1998',
  email_verified: true,
  headline: 'Backend Developer / Node.js',
  goals: 'Xay dung san pham cong nghe co kha nang mo rong va mang lai gia tri that cho nguoi dung.',
  skills: ['Node.js', 'React', 'MongoDB', 'PostgreSQL', 'Docker'],
  hobbies: ['Doc sach cong nghe', 'Chay bo', 'Nghe podcast'],
  experience: [
    {
      role: 'Backend Developer',
      company: 'Sky Tech Solutions',
      startYear: '2023',
      endYear: 'Now',
      details: ['Xay dung API cho he thong viec lam.', 'Toi uu truy van va monitoring production.'],
    },
    {
      role: 'Fullstack Developer',
      company: 'Mekong Studio',
      startYear: '2021',
      endYear: '2023',
      details: ['Phat trien dashboard noi bo.', 'Phoi hop giua frontend va backend cho san pham SME.'],
    },
  ],
  education: [
    {
      school: 'Dai hoc Cong nghe',
      degree: 'Ky su Cong nghe thong tin',
      startYear: '2017',
      endYear: '2021',
      details: ['Chuyen nganh Ky thuat phan mem', 'Tham gia cau lac bo lap trinh va cac du an nhom'],
    },
  ],
}

const MOCK_SETTING = {
  phone: '0901234567',
}

function wait(ms = 200) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export async function getMyProfile() {
  await wait()
  return { ...MOCK_PROFILE }
}

export async function getPublicProfile(id) {
  await wait()
  return { ...MOCK_PROFILE, username: id || MOCK_PROFILE.username }
}

export async function updateMyProfile(payload) {
  await wait()
  Object.assign(MOCK_PROFILE, {
    fullName: payload.fullName ?? MOCK_PROFILE.fullName,
    bio: payload.bio ?? MOCK_PROFILE.bio,
    address: payload.address ?? MOCK_PROFILE.address,
    skills: Array.isArray(payload.skills) ? payload.skills : MOCK_PROFILE.skills,
  })
  return { ...MOCK_PROFILE }
}

export async function getUserSetting() {
  await wait()
  return { ...MOCK_SETTING }
}

export async function updateUserSetting(payload) {
  await wait()
  Object.assign(MOCK_SETTING, { phone: payload.phone ?? MOCK_SETTING.phone })
  return { ...MOCK_SETTING }
}

export async function resendVerificationMail() {
  await wait()
  return { message: 'Da gui lai email xac minh.' }
}

export async function requestChangePasswordOtp() {
  await wait()
  return { message: 'OTP da duoc gui.', otpCode: '123456' }
}

export async function setNewPasswordWithOtp(payload) {
  await wait()
  if (!payload?.OtpCode) {
    throw new Error('OTP khong hop le.')
  }
  if (!payload?.newPassword || payload.newPassword !== payload.confirmNewPassword) {
    throw new Error('Mat khau xac nhan khong khop.')
  }
  return { message: 'Da dat mat khau moi.' }
}
