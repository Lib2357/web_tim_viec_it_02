export async function loadHardcodedMock() {
  const response = await fetch('/api/hardcoded.json')
  if (!response.ok) {
    throw new Error('Khong the tai du lieu hardcoded mock')
  }
  return response.json()
}
