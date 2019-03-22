import { Injectable } from '@angular/core';
import { Template } from '../../shared-codegen.service';
import { XmlCodeGenVisitor } from './xmlcodegenvisitor.service';

/**
 * @see XmlCodeGenVisitor implementation that can be used to generate Xamarin.Forms code.
 */
@Injectable({
    providedIn: 'root'
  })
export class XamarinFormsCodeGenVisitor extends XmlCodeGenVisitor {
    readonly SupportedTemplate: Template;

    constructor() {
      super();
      this.SupportedTemplate = Template.XAML;
    }

    protected visitLayer(layer: SketchMSLayer, template: string[] = [], depth: number = 0) {
      const content = this.visit(layer, template, depth + 1);
      if (content) {
        const attributes = [
          'VerticalAlignment="Top"',
          'HorizontalAlignment="Left"'
        ];
        template.push(this.indent(depth, this.openTag('Grid', attributes)));

        template.push(this.indent(depth + 1, this.openTag('Grid.ColumnDefinitions')));
        template.push(this.indent(depth + 2, this.openTag('ColumnDefinition', [], true)));
        template.push(this.indent(depth + 1, this.closeTag('Grid.ColumnDefinitions')));

        template.push(this.indent(depth + 1, this.openTag('Grid.RowDefinitions')));
        template.push(this.indent(depth + 2, this.openTag('RowDefinition', [], true)));
        template.push(this.indent(depth + 1, this.closeTag('Grid.RowDefinitions')));

        template.push(this.indent(depth + 1, content));

        template.push(this.indent(depth, this.closeTag('Grid')));
      }
    }

    protected visitBitmap(ast: SketchMSLayer): string {
      return 'some random bitmap';
    }

    protected visitText(attributedString: SketchMSAttributedString): string {
      return attributedString.string;
    }
}
