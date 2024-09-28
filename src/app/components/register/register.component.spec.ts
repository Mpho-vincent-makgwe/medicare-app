import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegisterComponent } from './register.component';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let httpTestingController: HttpTestingController;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterComponent, HttpClientTestingModule],
      providers: [
        { provide: Router, useValue: { navigate: jasmine.createSpy('navigate') } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    httpTestingController = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should register a user successfully', () => {
    component.fullName = 'John Doe';
    component.email = 'john.doe@example.com';
    component.username = 'johndoe';
    component.password = 'password123';

    component.register();

    const req = httpTestingController.expectOne('http://localhost:3000/api/register');
    expect(req.request.method).toEqual('POST');
    req.flush({ message: 'Registration successful' });  // Simulate a successful response

    expect(window.alert).toHaveBeenCalledWith('Registration successful!');
    expect(router.navigate).toHaveBeenCalledWith(['/some-route']); // Check for redirection if any
  });

  it('should handle registration failure', () => {
    component.fullName = 'Jane Doe';
    component.email = 'jane.doe@example.com';
    component.username = 'janedoe';
    component.password = 'password123';

    spyOn(window, 'alert');  // Spy on the alert function

    component.register();

    const req = httpTestingController.expectOne('http://localhost:3000/api/register');
    expect(req.request.method).toEqual('POST');
    req.flush('Registration failed', { status: 400, statusText: 'Bad Request' }); // Simulate an error response

    expect(window.alert).toHaveBeenCalledWith('Registration failed. Please try again.');
  });

  it('should navigate to login page', () => {
    component.navigateTo('/login');
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });

  afterEach(() => {
    httpTestingController.verify(); // Verify that no unmatched requests are outstanding
  });
});
