import { html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { map } from 'lit/directives/map.js';
import WebAwesomeElement from '../../internal/webawesome-element.js';
import styles from './file-input-styles.js';

@customElement('wa-file-input')
export default class WaFIleInput extends WebAwesomeElement {
  static css = styles;

  @state()
  isDragging = false;

  @state()
  error = false;

  @state()
  files: File[] = [];

  @property()
  label: string = 'Select a file';

  @property({ attribute: 'hint', reflect: true })
  hint: string | undefined = undefined;

  @property({ type: Boolean, reflect: true })
  disabled = false;

  @property({ type: Boolean })
  multiple: boolean = false;

  @property({ attribute: 'max-files' })
  maxFiles: number | undefined = undefined;

  @property({ attribute: 'accept' })
  acceptedFileFormat: string | undefined = undefined;

  @property({ attribute: 'max-size' })
  acceptedMaxFileSize: number | undefined = undefined;

  @property({ attribute: 'upload-icon' })
  uploadIcon: string | undefined = undefined;

  @property({ attribute: 'upload-icon-lib' })
  uploadIconLib: string | undefined = undefined;

  @property({ attribute: 'upload-message' })
  uploadMessage: string | undefined = undefined;

  private errorMessage: string | undefined = undefined;
  private errorFiles: File[] = [];

  override render() {
    return html`
      <label for="dropzone" class="file-input__label">
        <slot name="label"> ${this.label} </slot>
      </label>
      <div
        role="button"
        id="dropzone"
        class="dropzone${this.isDragging ? ' dragging' : ''}${this.error ? ' error' : ''}"
        tabindex="${this.disabled ? -1 : 0}"
        aria-label="${this.label}"
        aria-describedby="hint"
        aria-disabled="${this.disabled}"
        aria-invalid="${this.error}"
        @keydown=${this.handleKeyDown}
        @click=${this.handleClick}
        @dragenter=${this.handleDragEnter}
        @dragover=${this.handleDragOver}
        @dragleave=${this.handleDragLeave}
        @drop=${this.handleDrop}
      >
        <input tab-index="-1" type="file" hidden aria-hidden="true" @change=${this.handleFileSelect} />
        <div class="dropzone__content">
          <div class="upload-icon">
            <slot name="upload-icon">
              <wa-icon
                size="2rem"
                name="${this.uploadIcon ? this.uploadIcon : 'cloud-arrow-up'}"
                class="icon"
                square
              ></wa-icon>
            </slot>
          </div>
          <slot name="upload-message">
            <div>${this.uploadMessage ? this.uploadMessage : 'Drop file here or click to browse'}</div>
          </slot>
        </div>
      </div>
      <div id="hint" class="file-input__hint">
        <slot name="hint"> ${this.hint} </slot>
      </div>
      <div class="file-input__errors" ?hidden=${!this.error}>
        <wa-icon name="circle-xmark" variant="regular"></wa-icon>
        <strong>${this.errorMessage}</strong>
        ${map(this.errorFiles, file => html`<div>${file.name}</div>`)}
      </div>
      <div class="file-input__uploaded-files">
        ${this.files.map(
          file => html`
            <div class="file-input__uploaded-file">
              <div class="preview">
                ${file.type.startsWith('image/')
                  ? html`<img width="48" height="48" src=${this.getPreviewUrl(file)} alt=${file.name} />`
                  : html`<wa-icon size="48px" name="file" variant="regular"></wa-icon>`}
              </div>
              <p class="name">${file.name}</p>
              <div class="delete">
                <wa-icon name="xmark" size="1.5rem" class="icon" @click=${() => this.handleFileDelete(file)}> </wa-icon>
              </div>
            </div>
          `,
        )}
      </div>
    `;
  }

  private handleDragEnter = (event: DragEvent) => {
    this.clearErrors();
    event.preventDefault();
    this.isDragging = true;
  };

  private handleDragOver = (event: DragEvent) => {
    event.preventDefault();
  };

  private handleDragLeave = (event: DragEvent) => {
    event.preventDefault();
    console.log(event);
    this.isDragging = false;
  };

  private handleClick = () => {
    this.clearErrors();
    const input = this.renderRoot.querySelector('input[type="file"]') as HTMLInputElement;
    input.click();
  };

  private handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.handleClick();
    }
  };

  private handleDrop = (event: DragEvent) => {
    event.preventDefault();
    this.isDragging = false;
    this.handleFiles(event.dataTransfer?.files);
  };

  private handleFileSelect = (event: Event) => {
    const input = event.target as HTMLInputElement;
    this.handleFiles(input.files);
  };

  private handleFiles(files: FileList | null | undefined) {
    if (!files?.length) {
      return;
    }

    const acceptedFormats = this.acceptedFileFormat
      ? this.acceptedFileFormat.split(',').map(format => format.trim().toLowerCase())
      : [];

    const formatFilteredFiles = acceptedFormats.length
      ? [...files].filter(file =>
          acceptedFormats.some(format => {
            if (format.endsWith('/*')) {
              return file.type.toLowerCase().startsWith(format.slice(0, -1));
            }
            if (format.startsWith('.')) {
              return file.name.toLowerCase().endsWith(format);
            }
            return file.type.toLowerCase() === format;
          }),
        )
      : [...files];

    const acceptedFiles = this.acceptedMaxFileSize
      ? formatFilteredFiles.filter(file => file.size < this.acceptedMaxFileSize!)
      : formatFilteredFiles;

    if (this.arrayDif(acceptedFiles, [...files]).length > 0) {
      this.error = true;
      this.errorMessage =
        'Folgende Dateien entsprechen nicht den Vorraussetzungen und können nicht hochgeladen werden:';
      this.errorFiles = this.arrayDif(acceptedFiles, [...files]);
    }

    this.files = this.multiple ? [...this.files, ...acceptedFiles] : [...acceptedFiles];

    if (this.maxFiles) {
      this.files = this.files.slice(0, this.maxFiles);
      this.disabled = this.files?.length >= this.maxFiles;
    }
    this.dispatchFiles();
  }

  private getPreviewUrl(file: File): string {
    return URL.createObjectURL(file);
  }

  private arrayDif(a: any[], b: any[]) {
    return [...a.filter(item => !b.includes(item)), ...b.filter(item => !a.includes(item))];
  }

  private dispatchFiles() {
    this.dispatchEvent(
      new CustomEvent<File[]>('files-selected', {
        detail: this.files,
        bubbles: true,
        composed: true,
      }),
    );
  }

  private handleFileDelete(file: File) {
    this.files = this.files.filter(currentFile => currentFile != file);
    this.disabled = this.files?.length >= Number(this.maxFiles);
  }

  private clearErrors() {
    this.error = false;
    this.errorMessage = undefined;
    this.errorFiles = [];
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'wa-file-input': WaFIleInput;
  }
}
