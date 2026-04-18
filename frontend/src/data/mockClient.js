export async function loadPortalMock() {
  const response = await fetch('/api/portal.json')
  if (!response.ok) {
    throw new Error('Khong the tai du lieu portal mock')
  }
  return response.json()
}
