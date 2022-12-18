import { TestBed } from '@angular/core/testing';
import { PlacesTableComponent } from './places-table.component';

describe('PlacesTableComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PlacesTableComponent],
    }).compileComponents();
  });

  it('should create the component', () => {
    const fixture = TestBed.createComponent(PlacesTableComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

});
