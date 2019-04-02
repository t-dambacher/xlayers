import { Injectable } from '@angular/core';
import { CodeGenFacade, XlayersNgxEditorModel } from '../codegen.service';
import { XamarinFormsCodeGenVisitor } from './codegen/xamarin-forms-codegenvisitor.service';
import { readmeTemplate, applicationTemplate, mainPageTemplate } from './xamarin-forms.template';

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
      stackblitz: false
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
        uri: 'App.xaml',
        value: this.generateApplicationTemplate(),
        language: 'xaml',
        kind: 'xamarinForms'
      },
      {
        uri: 'MainPage.xaml',
        value: this.generateComponent(ast),
        language: 'xaml',
        kind: 'xamarinForms'
      },
      {
        uri: 'style.css',
        value: '*{}',
        language: 'css',
        kind: 'xamarinForms'
      },
      {
        uri: 'ast.json',
        value: JSON.stringify(ast, null, 2),
        language: 'JSON',
        kind: 'xamarinForms'
      }
    ];
  }

  private generateReadme() {
    return readmeTemplate();
  }

  private generateApplicationTemplate() {
    return applicationTemplate();
  }

  private generateComponent(ast: SketchMSLayer) {
    return this.codegen.generateTemplate(ast, mainPageTemplate);
  }
}
