import { Request, Response } from 'express'

import { StoreServices } from '../../../../store/infrastructure/services'
import { AuthServices } from '../../../infrastructure/services'

export class AuthController {
  /**
   * POST /api/auth
   */
  login = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, password } = req.body

      if (!email || !password) {
        res.status(400).json({
          success: false,
          error: 'Email and password are required'
        })
        return
      }

      const result = await AuthServices.loginUser.execute(email, password)

      const store = result.user.id ? await StoreServices.findByUserId.execute(String(result.user.id)) : null

      const data = {
        user: result.user,
        token: result.token,
        store: store
      }
      res.status(200).json({
        success: true,
        message: 'Login successful',
        data: data
      })
    } catch (error) {
      res.status(400).json({
        success: false,
        error: typeof error === 'object' && error !== null && 'message' in error ? (error as { message?: string }).message : 'Login failed'
      })
    }
  }

  /**
   * POST /api/auth/register
   */
  register = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, password, name } = req.body

      if (!email || !password || !name) {
        res.status(400).json({
          success: false,
          error: 'Email, password and name are required'
        })
        return
      }

      const result = await AuthServices.createUser.execute(email, password, name)

      res.status(201).json({
        success: true,
        data: result
      })
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: error.message || 'Register failed'
      })
    }
  }
}
