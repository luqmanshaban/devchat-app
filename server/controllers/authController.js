import jwt from 'jsonwebtoken'

export async function validate(req, res) {
   const authHeader = req.headers.authorization
  if(authHeader && authHeader.startsWith('Bearer')) {
    const token = authHeader.split(' ')[1];
    const decoded = jwt.decode(token, process.env.JWT_SECRET)

    if (decoded === null) {
      return res.status(200).json({ isAuth: false})
    }

    res.status(200).json({ isAuth: true})
    
  } else {
    res.status(401).send('Authorization header missing or malformed')
  }
  try {
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error })
  }
}
