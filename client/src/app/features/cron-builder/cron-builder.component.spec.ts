import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CronBuilderComponent } from './cron-builder.component';

describe('CronBuilderComponent', () => {
  let component: CronBuilderComponent;
  let fixture: ComponentFixture<CronBuilderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CronBuilderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CronBuilderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
