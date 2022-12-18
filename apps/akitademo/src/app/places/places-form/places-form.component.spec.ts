import { TestBed } from '@angular/core/testing';
import { PlacesFormComponent } from './places-form.component';

describe('PlacesFormComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PlacesFormComponent],
    }).compileComponents();
  });

  it('should create the component', () => {
    const fixture = TestBed.createComponent(PlacesFormComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

});
