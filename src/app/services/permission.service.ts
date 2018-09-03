import { Injectable } from '@angular/core';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class PermissionService {
  private permissions: any = {
    'user': [
      ''
    ],
    'group-admin': [
      'promote>group-admin',
      'create>group',
      'delete>channel',
      'delete>group',
      'create>channel',
      'channel>manageUsers',
      'group>manageUsers',
      'demote>group-admin',
    ],
    'super-admin': [
      'delete>user',
      'create>user',
      'promote>super-admin',
      'demote>super-admin'
    ]
  }

  constructor(private userService: UserService) { }

  hasPermission(permissionName: string): boolean {
    const userRank = this.userService.getUser().rank
    const userPermissions = this.generatePermissions(userRank)
    return userPermissions.some(element => element === permissionName)
  }

  generatePermissions(rank: string) {
    switch (rank) {
      case 'user':
        return this.permissions[rank]
      case 'group-admin':
        return [...this.permissions[rank], ...this.permissions['user']]
      case 'super-admin':
        return [
          ...this.permissions[rank],
          ...this.permissions['group-admin'],
          ...this.permissions['user']
        ]
      default:
        return []
    }
  }
}
