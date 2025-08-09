import { ScheduleStore } from '../../domain/entities/schedule_store.entity'
import { ScheduleStoreRepository } from '../../domain/repositories/schedule_store.repository'
import { CreateScheduleStoreDTO,CreateScheduleStoreUseCase } from './create-schedule-store.usecase'

describe('CreateScheduleStoreUseCase', () => {
  let mockRepository: jest.Mocked<ScheduleStoreRepository>
  let useCase: CreateScheduleStoreUseCase

  const baseDTO: CreateScheduleStoreDTO = {
    idStore: 'store-123',
    schDay: 1,
    schHoSta: '08:00',
    schHoEnd: '17:00',
    schState: 1
  }

  const existingSchedule = new ScheduleStore(
    'sch-001',
    'store-123',
    'id-123',
    1,
    '08:00',
    '12:00',
    1,
    new Date(),
    new Date()
  )

  beforeEach(() => {
    mockRepository = {
      findByDay: jest.fn(),
      update: jest.fn(),
      create: jest.fn()
    } as unknown as jest.Mocked<ScheduleStoreRepository>

    useCase = new CreateScheduleStoreUseCase(mockRepository)
  })

  it('should create a new schedule when no existing schedule is found', async () => {
    mockRepository.findByDay.mockResolvedValue(null)
    const createdSchedule = { ...existingSchedule, schId: 'sch-new' }
    mockRepository.create.mockResolvedValue(createdSchedule as ScheduleStore)

    const result = await useCase.execute(baseDTO)

    expect(mockRepository.findByDay).toHaveBeenCalledWith(1)
    expect(mockRepository.create).toHaveBeenCalled()
    expect(result.success).toBe(true)
    expect(result.message).toBe('Horario creado correctamente')
    expect(result.data).toEqual(createdSchedule)
  })

  it('should update an existing schedule when found', async () => {
    mockRepository.findByDay.mockResolvedValue(existingSchedule)
    const updatedSchedule = { ...existingSchedule, schHoSta: '09:00' }
    mockRepository.update.mockResolvedValue(updatedSchedule as ScheduleStore)

    const result = await useCase.execute({
      ...baseDTO,
      schHoSta: '09:00'
    })

    expect(mockRepository.findByDay).toHaveBeenCalledWith(1)
    expect(mockRepository.update).toHaveBeenCalledWith(existingSchedule.schId, expect.any(Object))
    expect(result.success).toBe(true)
    expect(result.message).toBe('Horario actualizado correctamente')
    expect(result.data).toEqual(updatedSchedule)
  })

  it('should return error message if update fails', async () => {
    mockRepository.findByDay.mockResolvedValue(existingSchedule)
    mockRepository.update.mockResolvedValue(null)

    const result = await useCase.execute({
      ...baseDTO,
      schHoSta: '09:00'
    })

    expect(result.success).toBe(false)
    expect(result.message).toBe('Error al actualizar el horario')
    expect(result.data).toBeUndefined()
  })

  it('should throw if repository throws an error', async () => {
    mockRepository.findByDay.mockRejectedValue(new Error('DB error'))

    await expect(useCase.execute(baseDTO)).rejects.toThrow('DB error')
  })
})
