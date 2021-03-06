import { DocNodeKind, IDocNodeParameters, DocNode } from './DocNode';
import { StringChecks } from '../parser/StringChecks';
import { DocParticle } from './DocParticle';
import { Excerpt } from '../parser/Excerpt';

/**
 * Constructor parameters for {@link DocInlineTag}.
 */
export interface IDocInlineTagParameters extends IDocNodeParameters {
  openingDelimiterExcerpt?: Excerpt;

  tagNameExcerpt?: Excerpt;
  tagName: string;

  tagContentExcerpt?: Excerpt;
  tagContent: string;

  closingDelimiterExcerpt?: Excerpt;
}

/**
 * Represents a TSDoc inline tag such as `{@inheritdoc}` or `{@link}`.
 */
export class DocInlineTag extends DocNode {
  /** {@inheritdoc} */
  public readonly kind: DocNodeKind = DocNodeKind.InlineTag;

  private readonly _openingDelimiterParticle: DocParticle;
  private readonly _tagNameParticle: DocParticle;
  private readonly _tagContentParticle: DocParticle;
  private readonly _closingDelimiterParticle: DocParticle;

  /**
   * Don't call this directly.  Instead use {@link TSDocParser}
   * @internal
   */
  public constructor(parameters: IDocInlineTagParameters) {
    super(parameters);

    this._openingDelimiterParticle = new DocParticle({
      excerpt: parameters.openingDelimiterExcerpt,
      content: '{'
    });

    StringChecks.validateTSDocTagName(parameters.tagName);
    this._tagNameParticle = new DocParticle({
      excerpt: parameters.tagNameExcerpt,
      content: parameters.tagName
    });

    this._tagContentParticle = new DocParticle({
      excerpt: parameters.tagContentExcerpt,
      content: parameters.tagContent
    });

    this._closingDelimiterParticle = new DocParticle({
      excerpt: parameters.closingDelimiterExcerpt,
      content: '}'
    });
  }

  /**
   * The TSDoc tag name.
   * For example, if the inline tag is `{@link Guid.toString | the toString() method}`
   * then the tag name would be `@link`.
   */
  public get tagName(): string {
    return this._tagNameParticle.content;
  }

  /**
   * The tag content.
   * For example, if the inline tag is `{@link Guid.toString | the toString() method}`
   * then the tag content would be `Guid.toString | the toString() method`.
   */
  public get tagContent(): string {
    return this._tagContentParticle.content;
  }

  /**
   * {@inheritdoc}
   * @override
   */
  public getChildNodes(): ReadonlyArray<DocNode> {
    return [
      this._openingDelimiterParticle,
      this._tagNameParticle,
      this._tagContentParticle,
      this._closingDelimiterParticle
    ];
  }
}
