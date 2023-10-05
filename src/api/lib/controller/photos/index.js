export async function updatePhoto (req, res) {
  try {
    return res.json({
      message: 'Successfully updated'
    })
  } catch (e) {
    return res.json({
      message: e
    })
  }
}
