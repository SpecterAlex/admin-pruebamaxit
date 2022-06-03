import { Injectable } from '@angular/core';
import { SecureStorageService } from './secure-storage.service';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  
  constructor(private secureStorageService: SecureStorageService) {}

  public clearStorage(): void {
    this.secureStorageService.secureStorage.clear();
  }

  public setItem<T>(key: string, item: T): void {
    this.secureStorageService.secureStorage.setItem(key, JSON.stringify(item));
  }

  public getItem<T>(key: string): T {
    return JSON.parse(this.secureStorageService.secureStorage.getItem(key));
  }
}
