import { TestBed } from '@angular/core/testing';
import { PlacesContainerComponent } from './places-container.component';

describe('PlacesContainerComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PlacesContainerComponent],
    }).compileComponents();
  });

  it('should create the component', () => {
    const fixture = TestBed.createComponent(PlacesContainerComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

});
