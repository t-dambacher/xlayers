import { Injectable } from '@angular/core';
import { Template } from '../../shared-codegen.service';
import { XmlCodeGenVisitor } from './xmlcodegenvisitor.service';
import { strict } from 'assert';
import { Shape } from './shape.service';

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
    const attributes = [];

    let content;
    // bait the transcrcipter
    const bait = (layer as any)._class;
    if ('group' === bait) {
      template.push(this.indent(depth, this.openGroup(layer)));
      content = this.visit(layer, template, depth + 1);
      template.push(this.indent(depth + 1, this.closeTag('AbsoluteLayout')));
      template.push(this.indent(depth, this.closeTag('Frame')));
    } else {
      content = this.visit(layer, template, depth + 1);
    }

    if (content) {
      template.push(this.indent(depth + 1, content));
    }
  }

  protected visitBitmap(ast: SketchMSLayer): string {
    return `<Image Source="${(ast as any).image._ref}">`;
  }

  protected visitText(ast: SketchMSLayer): string {
    return `<Label Text="${ast.attributedString.string}"
       FontSize="${ast.attributedString.attributes[0].attributes.MSAttributedStringFontAttribute.attributes.size}"
       FontFamily="${ast.attributedString.attributes[0].attributes.MSAttributedStringFontAttribute.attributes.name}"
       TextColor="${this.colorRatioToHex(
         (ast.attributedString.attributes[0].attributes as any).MSAttributedStringColorAttribute.red,
         (ast.attributedString.attributes[0].attributes as any).MSAttributedStringColorAttribute.green,
         (ast.attributedString.attributes[0].attributes as any).MSAttributedStringColorAttribute.blue
       )}"
       Opacity="${(ast.attributedString.attributes[0].attributes as any).MSAttributedStringColorAttribute.alpha}"
       AbsoluteLayout.LayoutBounds="${Math.round( ast.frame.x)}, ${Math.round(ast.frame.y)}, ${Math.round(ast.frame.width)}, ${Math.round(ast.frame.height)}"/>`;
  }

  protected visitShape(ast: SketchMSLayer): string {
    if ((ast as any).shapeVisited === true) {
      return null;
    }

    const a = new Shape((ast as any).points);

    if (a.is_round()) {
      return `<Frame AbsoluteLayout.LayoutBounds="${Math.round(ast.frame.x)}, ${Math.round(ast.frame.y)}, ${Math.round(ast.frame.width)}, ${Math.round(ast.frame.height)}"`
        + ` CornerRadius="${ast.frame.width / 2}"`
        + (!!ast.style.fills
            ? ' BackgroundColor="'
              + this.colorRatioToHex(ast.style.fills[0].color.red, ast.style.fills[0].color.green, ast.style.fills[0].color.blue)
              + '" Opacity="' + ast.style.fills[0].color.alpha + '"'
          : '')
        + (!!ast.style.borders
            ? ' BorderColor="'
              + this.colorRatioToHex(ast.style.borders[0].color.red, ast.style.borders[0].color.green, ast.style.borders[0].color.blue) + '"'
            : '')
        + ' />';
    } else if (a.is_rectangle()) {
      if (!!ast.style.borders) {
        return `<Frame AbsoluteLayout.LayoutBounds="${Math.round(ast.frame.x)}, ${Math.round(ast.frame.y)}, ${Math.round(ast.frame.width)}, ${Math.round(ast.frame.height)}"`
        + ` CornerRadius="0"`
        + ` BorderColor="${this.colorRatioToHex(ast.style.borders[0].color.red, ast.style.borders[0].color.green, ast.style.borders[0].color.blue)}"`
        + (!!ast.style.fills
            ? ` BackgroundColor="${this.colorRatioToHex(ast.style.fills[0].color.red, ast.style.fills[0].color.green, ast.style.fills[0].color.blue)}"`
              + ` Opacity="${ast.style.fills[0].color.alpha}"`
            : ``)
        + ` />`;
      } else if (!!ast.style.fills) {
        return `<BoxView AbsoluteLayout.LayoutBounds="${Math.round(ast.frame.x)}, ${Math.round(ast.frame.y)}, ${Math.round(ast.frame.width)}, ${Math.round(ast.frame.height)}"`
        + ` Color="${this.colorRatioToHex(ast.style.fills[0].color.red, ast.style.fills[0].color.green, ast.style.fills[0].color.blue)}"`
        + ` Opacity="${ast.style.fills[0].color.alpha}" />`;
      } else {
        return ``;
      }
    } else if (a.is_line()) {
      console.log(ast);
      return `<BoxView AbsoluteLayout.LayoutBounds="${Math.round(ast.frame.x)}, ${Math.round(ast.frame.y)}, ${Math.round(ast.frame.width)}, 1}"`
        + (!!ast.style.fills
            ? ` Color="${this.colorRatioToHex(ast.style.fills[0].color.red, ast.style.fills[0].color.green, ast.style.fills[0].color.blue)}"`
            + ` Opacity="${ast.style.fills[0].color.alpha}" />`
            : ` Color="${this.colorRatioToHex(ast.style.borders[0].color.red, ast.style.borders[0].color.green, ast.style.borders[0].color.blue)}"`
            + ` Opacity="${ast.style.borders[0].color.alpha}" />`);
    } else {
      return `<!-- ${(ast as any).shape} -->`;
    }
  }

  protected visitOther(ast: SketchMSLayer): string {
    if ((ast as any).shapeVisited === true) {
      return null;
    }

    if ((ast as any)._class === 'oval' || (ast as any)._class === 'rectangle') {
      return `<Frame AbsoluteLayout.LayoutBounds="${Math.round(ast.frame.x)}, ${Math.round(ast.frame.y)}, ${Math.round(ast.frame.width)}, ${Math.round(ast.frame.height)}"`
        + ` CornerRadius="${((ast as any)._class === 'oval' ? ast.frame.width / 2 : '0')}"`
        + (!!ast.style.fills
            ? ' BackgroundColor="'
              + this.colorRatioToHex(ast.style.fills[0].color.red, ast.style.fills[0].color.green, ast.style.fills[0].color.blue)
              + '" Opacity="' + ast.style.fills[0].color.alpha + '"'
          : '')
        + (!!ast.style.borders
            ? ' BorderColor="'
              + this.colorRatioToHex(ast.style.borders[0].color.red, ast.style.borders[0].color.green, ast.style.borders[0].color.blue) + '"'
            : '')
        + ' />';
    }

  }

  protected openGroup(ast: SketchMSLayer): string {
    const border = this.checkLayersForBorder(ast);
    const background = this.checkLayersForBackground(ast);

    return `<Frame AbsoluteLayout.LayoutBounds="${Math.round(ast.frame.x)}, ${Math.round(ast.frame.y)}, ${Math.round(ast.frame.width)}, ${Math.round(ast.frame.height)}"`
      + ` CornerRadius="0" Padding="0"`
      + (border !== false ? ' BorderColor="' + border + '"' : '')
      + (background !== false ? ' BackgroundColor="' + background + '"' : '')
      + `>`
      + `\n  <AbsoluteLayout>`;
  }
}
