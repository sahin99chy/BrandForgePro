import { users, brandGenerations, type User, type InsertUser, type BrandGeneration, type InsertBrandGeneration } from "@shared/schema";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  createBrandGeneration(generation: InsertBrandGeneration): Promise<BrandGeneration>;
  getBrandGenerations(): Promise<BrandGeneration[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private brandGenerations: Map<number, BrandGeneration>;
  private currentUserId: number;
  private currentGenerationId: number;

  constructor() {
    this.users = new Map();
    this.brandGenerations = new Map();
    this.currentUserId = 1;
    this.currentGenerationId = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async createBrandGeneration(insertGeneration: InsertBrandGeneration): Promise<BrandGeneration> {
    const id = this.currentGenerationId++;
    const generation: BrandGeneration = { ...insertGeneration, id };
    this.brandGenerations.set(id, generation);
    return generation;
  }

  async getBrandGenerations(): Promise<BrandGeneration[]> {
    return Array.from(this.brandGenerations.values());
  }
}

export const storage = new MemStorage();
