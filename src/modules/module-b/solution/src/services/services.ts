import { Service } from '../entities/Service';

export const getAllServices = async () => Service.find();
