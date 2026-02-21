import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { ListaUsersComponent } from './lista-users.component';
import { UsersService } from '../service/users.service';
import { UserDTO } from '../users';

describe('ListaUsersComponent (Fase 5)', () => {
  let component: ListaUsersComponent;
  let fixture: ComponentFixture<ListaUsersComponent>;

  const mockUsers: UserDTO[] = [
    { id: 1, username: 'alice', email: 'alice@mail.com', displayName: 'Alice', role: 'USER', status: 'ACTIVE' },
    { id: 2, username: 'bob', email: 'bob@test.org', displayName: 'Bob Smith', role: 'ADMIN', status: 'ACTIVE' },
    { id: 3, username: 'charlie', email: 'charlie@example.com', displayName: 'Charlie', role: 'USER', status: 'BANNED' },
  ];

  beforeEach(async () => {
    const usersServiceSpy = jasmine.createSpyObj<UsersService>('UsersService', ['list', 'updateStatus', 'updateRole']);
    usersServiceSpy.list.and.returnValue(of(mockUsers));

    await TestBed.configureTestingModule({
      imports: [ListaUsersComponent],
      providers: [
        { provide: UsersService, useValue: usersServiceSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ListaUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('filteredUsers', () => {
    beforeEach(() => {
      component.users = [...mockUsers];
    });

    it('sin searchInput devuelve todos los usuarios', () => {
      component.searchInput = '';
      expect(component.filteredUsers).toEqual(mockUsers);
    });

    it('filtra por username', () => {
      component.searchInput = 'bob';
      expect(component.filteredUsers.length).toBe(1);
      expect(component.filteredUsers[0].username).toBe('bob');
    });

    it('filtra por email', () => {
      component.searchInput = 'charlie@example';
      expect(component.filteredUsers.length).toBe(1);
      expect(component.filteredUsers[0].email).toBe('charlie@example.com');
    });

    it('filtra por displayName', () => {
      component.searchInput = 'Smith';
      expect(component.filteredUsers.length).toBe(1);
      expect(component.filteredUsers[0].displayName).toBe('Bob Smith');
    });

    it('con searchInput que no coincide devuelve array vacío', () => {
      component.searchInput = 'xyz';
      expect(component.filteredUsers).toEqual([]);
    });

    it('filtro es case-insensitive', () => {
      component.searchInput = 'ALICE';
      expect(component.filteredUsers.length).toBe(1);
      expect(component.filteredUsers[0].username).toBe('alice');
    });
  });
});
