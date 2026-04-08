import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupsManagement } from './groups-management';

describe('GroupsManagement', () => {
  let component: GroupsManagement;
  let fixture: ComponentFixture<GroupsManagement>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GroupsManagement]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GroupsManagement);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
