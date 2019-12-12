// Based on https://codepen.io/Kiwka/pen/YNYvyG by Olena Sovyn

import React from "react";
// import ReactDOM from "react-dom";
import {Editor, EditorState, RichUtils} from 'draft-js';
import { Helmet } from "react-helmet";
import numbered_list_img from "../../../data/img/numbered-list-26.png";
import unordered_list_img from "../../../data/img/bulleted-list-30.png";
import quote_img from "../../../data/img/quote-double.png";
import bold_img from "../../../data/img/bold-24.png";
import italic_img from "../../../data/img/italic-26.png";
import underlined_img from "../../../data/img/underline-24.png";
import code_img from "../../../data/img/code-26.png";
import monospace_img from "../../../data/img/monospaced-font-24.png";
import header1_img from "../../../data/img/header-1-30.png";
import header2_img from "../../../data/img/header-2-30.png";
import header3_img from "../../../data/img/header-3-30.png";

import './MainEditor.css';

class MainEditor extends React.Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.focus = () => this.refs.editor.focus();
        this.onChange = this.onChange.bind(this);

        this.handleKeyCommand = (command) => this._handleKeyCommand(command);
        this.onTab = (e) => this._onTab(e);
        this.toggleBlockType = (type) => this._toggleBlockType(type);
        this.toggleInlineStyle = (style) => this._toggleInlineStyle(style);

        const editor_state = (props.editorState.length > 0)? (props.editorState.length) : EditorState.createEmpty();
        this.state={
            editorState: editor_state,
            text: null,
        }
    }

    onChange(editorState){
        // \U+FFFD is the separator
        const text = editorState.getCurrentContent().getPlainText("\n");
        this.setState({ editorState: editorState, text: text });
        this.props.handleTextChange(text, editorState);
    }

    _handleKeyCommand(command) {
        const { editorState } = this.state;
        const newState = RichUtils.handleKeyCommand(editorState, command);
        if (newState) {
            this.onChange(newState);
            return true;
        }
        return false;
    }

    _onTab(e) {
        const maxDepth = 4;
        this.onChange(RichUtils.onTab(e, this.state.editorState, maxDepth));
    }

    _toggleBlockType(blockType) {
        this.onChange(
            RichUtils.toggleBlockType(
                this.state.editorState,
                blockType
            )
        );
    }

    _toggleInlineStyle(inlineStyle) {
        this.onChange(
            RichUtils.toggleInlineStyle(
                this.state.editorState,
                inlineStyle
            )
        );
    }

    render() {
        // Custom overrides for "code" style.
        const styleMap = {
            CODE: {
                backgroundColor: 'rgba(0, 0, 0, 0.05)',
                fontFamily: '"Inconsolata", "Menlo", "Consolas", monospace',
                fontSize: 16,
                padding: 2,
            },
        };

        const { editorState } = this.state;

        // If the user changes block type before entering any text, we can
        // either style the placeholder or hide it. Let's just hide it now.
        let className = 'RichEditor-editor';
        let contentState = editorState.getCurrentContent();
        if (!contentState.hasText()) {
            if (contentState.getBlockMap().first().getType() !== 'unstyled') {
                className += ' RichEditor-hidePlaceholder';
            }
        }

        return (
            <div className="RichEditor-root">
                <Helmet>
                    <meta charSet="utf-8"/>
                </Helmet>
                <BlockStyleControls
                    editorState={editorState}
                    onToggle={this.toggleBlockType}
                />
                <InlineStyleControls
                    editorState={editorState}
                    onToggle={this.toggleInlineStyle}
                />
                <div className={className} onClick={this.focus}>
                    <Editor
                        blockStyleFn={getBlockStyle}
                        customStyleMap={styleMap}
                        editorState={editorState}
                        handleKeyCommand={this.handleKeyCommand}
                        onChange={this.onChange}
                        onTab={this.onTab}
                        ref="editor"
                        spellCheck={false}
                        className="main-editor-font-size"
                    />
                </div>
            </div>
        );
    }
}

function getBlockStyle(block) {
    switch (block.getType()) {
        case 'blockquote': return 'RichEditor-blockquote';
        default: return null;
    }
}

class StyleButton extends React.Component {
    constructor() {
        super();
        this.onToggle = (e) => {
            e.preventDefault();
            this.props.onToggle(this.props.style);
        };
    }

    render() {
        let className = 'RichEditor-styleButton';
        if (this.props.active) {
            className += ' RichEditor-activeButton';
        }

        const english_chinese = {
            "有序列表": numbered_list_img,
            "无序列表": unordered_list_img,
            "引用": quote_img,
            "粗体": bold_img,
            "斜体": italic_img,
            "下划线": underlined_img,
            "代码块": code_img,
            "等宽字体": monospace_img,
            "大标题": header1_img,
            "中标题": header2_img,
            "小标题": header3_img,
        }

        return (
            <span className={className} onMouseDown={this.onToggle}>
                <img src={english_chinese[this.props.label]}
                    alt={this.props.label}
                    width={24}
                    height={24}/>
            </span>
        );
    }
}

const BLOCK_TYPES = [
    { label: '大标题', style: 'header-one' },
    { label: '中标题', style: 'header-two' },
    { label: '小标题', style: 'header-three' },
    { label: '引用', style: 'blockquote' },
    { label: '无序列表', style: 'unordered-list-item' },
    { label: '有序列表', style: 'ordered-list-item' },
    { label: '代码块', style: 'code-block' },
];

const BlockStyleControls = (props) => {
    const { editorState } = props;
    const selection = editorState.getSelection();
    const blockType = editorState
        .getCurrentContent()
        .getBlockForKey(selection.getStartKey())
        .getType();

    return (
        <div className="RichEditor-controls">
            {BLOCK_TYPES.map((type) =>
                <StyleButton
                    key={type.label}
                    active={type.style === blockType}
                    label={type.label}
                    onToggle={props.onToggle}
                    style={type.style}
                />
            )}
        </div>
    );
};

var INLINE_STYLES = [
    { label: '粗体', style: 'BOLD' },
    { label: '斜体', style: 'ITALIC' },
    { label: '下划线', style: 'UNDERLINE' },
    { label: '等宽字体', style: 'CODE' },
];

const InlineStyleControls = (props) => {
    var currentStyle = props.editorState.getCurrentInlineStyle();
    return (
        <div className="RichEditor-controls">
            {INLINE_STYLES.map(type =>
                <StyleButton
                    key={type.label}
                    active={currentStyle.has(type.style)}
                    label={type.label}
                    onToggle={props.onToggle}
                    style={type.style}
                />
            )}
        </div>
    );
};


export default MainEditor;