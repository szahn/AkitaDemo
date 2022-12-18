import { TestBed } from '@angular/core/testing';
import { PlacesMapComponent } from './places-map.component';

describe('PlacesMapComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PlacesMapComponent],
    }).compileComponents();
  });

  it('should create the component', () => {
    const fixture = TestBed.createComponent(PlacesMapComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

});
