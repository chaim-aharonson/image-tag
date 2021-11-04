import React, {createRef, useEffect, useRef, useState} from "react";
import * as _ from "lodash";
import {invertColor, stringToColor} from "../common/utils";

const verifyNewTagDup = ({tags, label}) => {
	let isValid = true;
	_.each(tags, tag => {
		if(isValid && _.lowerCase(tag.label) === _.lowerCase(label)){
			isValid = false;
		}
	})
	return isValid;
}
export function NewTag(props){
	const {tags, updateTagName} = props;
	const [newTagName, setNewTagName] = useState('');
	const [newTagValid, setNewTagValid] = useState(false);
	const onChange = (e) => {
		const target = e && e.target;
		const label = target.value;
		setNewTagName(label);
		setNewTagValid(verifyNewTagDup({tags, label}))
	}
	const addNewTag = () => {
		const value = + new Date().getTime();
		updateTagName({value, label: newTagName})
		setNewTagName('');
		setNewTagValid(false)
	}
	return <div  className='new-tag-container'>
		<input type='text' value={newTagName} maxLength={30} placeholder={'new tag'} onChange={(e)=>onChange(e)}/>
		<button type='button' onClick={addNewTag} disabled={!newTagValid}>Add</button>
	</div>
}
export function TagsContainer(props){
	const {tags, updateTagName} = props;
	const containerWidth = 300;
	const [_fieldsWidths, setFieldsWidths] = useState({});
	const [_tags, setTags] = useState({});
	const textFakeInputs = useRef({});
	const getFieldSize = (value) => {
		return _.min([_.max([_.round(textFakeInputs.current[value].getBoundingClientRect().width), 50]), containerWidth]);
	}
	const onChange = (e, value) => {
		const target = e && e.target;
		const label = target.value;
		updateTagName({value, label});
		setTimeout(()=> {
			const fieldsWidths = _.cloneDeep(_fieldsWidths);
			fieldsWidths[value] = getFieldSize(value)
			setFieldsWidths(fieldsWidths)
		}, 10)
	}
	useEffect(() => {
		if(_.size(_tags) !== _.size(tags)){
			setTags(tags);
			const fieldsWidths = _.reduce(tags, (mem, tag) => {
				if(textFakeInputs.current[tag.value]) {
					mem[tag.value] = getFieldSize(tag.value)
				}
				return mem;
			}, {})
			setFieldsWidths(fieldsWidths)
		}
	}, [tags]);

	return <div className='tags-container' style={{width: containerWidth, minWidth: containerWidth}}>
		<NewTag updateTagName={updateTagName} tags={tags}/>
		{
			_.map(tags, (tag, idx) => {
				const tag_label = tag.label;
				const {value} = tag;
				const bgColor = stringToColor(tag_label)
				const color = invertColor(bgColor)
				return <div key={idx} className='tag-name-wrap'>
					<div className='tag-name' style={{backgroundColor: bgColor, borderColor: bgColor, opacity: typeof _fieldsWidths[value] === 'number' ? 1 : 0}}>
						<input type='text' value={tag_label} maxLength={30} style={{width: _fieldsWidths[value] || 50, color}} placeholder={'un-named'} onChange={(e)=>onChange(e, value)}/>
						<div className='fake-input' ref={(ref) => textFakeInputs.current[value] = ref} style={{opacity: 0}}>{tag_label}</div>
					</div>
				</div>
			})
		}
	</div>
}