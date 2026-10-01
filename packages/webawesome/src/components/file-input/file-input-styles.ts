import { css } from 'lit';

export default css`
  :host {
    display: block;
  }

  :host([disabled]) {
    & > *:not(.file-input__uploaded-files) {
      opacity: 0.5;
      pointer-events: none;
    }
  }

  .dropzone {
    border: dashed 2px var(--dce-default-neutral-fill-loud);
    // var(--dce-file-input-border-style); var(--dce-file-input-border-width); var(--dce-default-neutral-fill-loud);
    border-radius: 8px;
    // var(--dce-file-input-border-radius);
    padding: 3rem;
    // var(--dce-file-input-padding);
    text-align: center;
    cursor: pointer;
    color: var(--dce-default-neutral-fill-loud);
    transition-property: color, background-color, border-color;
    transition-duration: 0.5s;
    transition-timing-function: ease-out;

    &.dragging {
      border-color: var(--dce-default-brand-fill-loud);
      background-color: var(--dce-default-brand-fill-quiet);
    }

    &.error {
      color: var(--dce-default-danger-fill-loud);
      border-color: var(--dce-default-danger-fill-loud);
    }

    &:hover {
      color: var(--dce-default-brand-fill-loud);
      border-color: var(--dce-default-brand-fill-loud);
      background-color: var(--dce-default-brand-fill-quiet);
    }

    &:focus-visible {
      outline: solid 0.1875rem var(--dce-default-brand-fill-normal);
      // var(--dce-focus-ring);
      outline-offset: 0.0625rem;
      // var(--dce-focus-ring-offset);
    }

    & > * {
      pointer-events: none;
    }
  }

  .file-input__label {
    color: var(--dce-default-neutral-fill-loud);
  }

  .file-input__hint {
    font-size: 0.875rem;
    // font-size: var(--dce-font-size-s);
    color: var(--dce-default-neutral-fill-loud);
    padding-top: 0.25rem;
    // padding-top: var(--dce-file-input-hint-padding-top);
  }

  .dropzone__content {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .upload-icon {
    display: inline-flex;
    background-color: white;
    border-radius: 50%;
    padding: 1rem;
  }

  .file-input__errors {
    font-size: 0.75rem;
    border-radius: 4px;
    padding: 1rem;
    color: var(--dce-default-danger-fill-loud);
    background-color: var(--dce-default-danger-fill-quiet);
  }

  .file-input__uploaded-files {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .file-input__uploaded-file {
    display: flex;
    flex-direction: row;
    gap: 1rem;
    align-items: center;
    background-color: #e2e2e2;
    padding: 0.5rem;
    border-radius: 4px;

    .preview {
      display: flex;
    }

    .name {
      flex: 1 1 0;
    }

    .delete {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 48px;
      height: 48px;

      .icon:hover {
        border-radius: 4px;
        padding: 4px;
        cursor: pointer;
      }
    }
  }
`;
