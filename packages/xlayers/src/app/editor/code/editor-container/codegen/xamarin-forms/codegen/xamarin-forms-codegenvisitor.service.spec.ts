import { inject, TestBed } from '@angular/core/testing';
import { XamarinFormsCodeGenVisitor } from './xamarin-forms-codegenvisitor.service';

describe('XamarinFormsCodeGenVisitor', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        XamarinFormsCodeGenVisitor,
        {
          provide: XamarinFormsCodeGenVisitor,
          useValue: {}
        }
      ]
    });
  });

  // todo: add some tests
});
