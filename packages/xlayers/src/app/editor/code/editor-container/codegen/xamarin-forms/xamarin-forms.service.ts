import { Injectable } from '@angular/core';
import { CodeGenFacade, XlayersNgxEditorModel } from '../codegen.service';
import { XamarinFormsCodeGenVisitor } from './codegen/xamarin-forms-codegenvisitor.service';
import { readmeTemplate } from './xamarin-forms.template';

/**
 * @see CodeGenFacade implementation able to generate Xamarin.Forms code
 */
@Injectable({
  providedIn: 'root'
})
export class XamarinFormsCodeGenService implements CodeGenFacade {

  constructor(private readonly codegen: XamarinFormsCodeGenVisitor) {}

  buttons() {
    return {
      stackblitz: true
    };
  }

  generate(ast: SketchMSLayer): Array<XlayersNgxEditorModel> {
    return [
      {
        uri: 'README.md',
        value: this.generateReadme(),
        language: 'markdown',
        kind: 'text'
      },
      {
        uri: 'Form.xaml',
        value: this.generateComponent(ast),
        language: 'xaml',
        kind: 'xamarinForms'
      }
    ];
  }

  private generateReadme() {
    return readmeTemplate();
  }

  private generateComponent(ast: SketchMSLayer) {
    return this.codegen.generateTemplate(ast);
  }
}
