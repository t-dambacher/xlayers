import { Template } from '../../shared-codegen.service';

/**
 * Visitor-like pattern used for code generation purposes, by iterating through an AST and
 * delegating the codegen to its subclasses.
 */
export abstract class CodeGenVisitor {
    abstract readonly SupportedTemplate: Template;

    /**
     * Generates a string template by visiting the tree
     * @param ast The Sketch AST
     */
    generateTemplate(ast: SketchMSLayer): string {
      const template: Array<string> = [];
      this.visit(ast, template, 0);
      return template.join('\n');
    }

    protected visit(ast: SketchMSLayer, template: string[] = [], depth: number = 0): string {
      if (ast.layers && Array.isArray(ast.layers)) {
        ast.layers.forEach(layer => this.visitLayer(layer, template, depth));
      } else {
        if ((ast as any)._class === 'text') {
          return this.visitText(ast.attributedString);
        } else if ((ast as any)._class === 'bitmap') {
          return this.visitBitmap(ast);
        } else if ((ast as any).shape) {
          return this.visitShape((ast as any).shape);
        }
      }
    }

    protected visitLayer(layer: SketchMSLayer, template: string[], depth: number) {
        const content = this.visit(layer, template, depth + 1);
        if (content) {
          template.push(content);
        }
    }

    protected visitShape(shape: any): string {
      return shape;
    }

    protected abstract visitText(attributedString: SketchMSAttributedString): string;
    protected abstract visitBitmap(ast: SketchMSLayer): string;
}
