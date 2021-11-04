import React, {useEffect, useState} from "react";
import * as _ from "lodash";
import AsyncSelect from 'react-select/async';
import {image_width, invertColor, stringToColor} from "../common/utils";

function TagsSelector(props){
	const {tags, uuid: imageUuid, tagsByImageMap, updateImageTags} = props;
	const [_tags, setTags] = useState([]);
	const [_isLoading, setIsLoading] = useState(false);
	const [options, setOptions] = useState([]);
	const [defaultValue, setDefaultValue] = useState(_.map(tagsByImageMap[imageUuid], tagUuid => tags[tagUuid]));
	const onChange = (selectedOptions) => {
		updateImageTags({tagsUuids: _.map(selectedOptions, opt => opt.value), imageUuid})
	}
	useEffect(() => {
		if(!_.isEqual(_tags, tags)){
			setIsLoading(true)
			setOptions([])
			setTags(tags);
			setDefaultValue([])
		}
	}, [tags]);
	useEffect(() => {
		setTags(tags);
		setOptions(_.values(tags))
	}, [])
	return <AsyncSelect options={options}
	               defaultValue={defaultValue}
	               cacheOptions={false}
	               className='basic-multi-select'
	               classNamePrefix='select'
	               onChange={onChange}
	               isMulti />
}

export function ImagesContainer(props){
	const {images, updateImageName, updateImageTags, tagsByImageMap, tags} = props;
	const onChange = (e, uuid) => {
		const target = e && e.target;
		const label = target.value;
		updateImageName({uuid, label})
	}
	const style = {
		flexBasis: `${image_width + 20}px`,
		maxWidth: `${image_width + 20}px`
	}
	return <div className='images-container'>
		{
			_.map(images, (imageObj, idx) => {
				const {url, label, uuid} = imageObj;
				return <div key={idx} style={style}>
					<div><img src={url} alt=''/></div>
					<input type='text' value={label} placeholder={'un-named'} onChange={(e)=>onChange(e, uuid)}/>
					<div className='image-tags-wrapper'>
						<TagsSelector tags={tags} uuid={uuid} updateImageTags={updateImageTags} tagsByImageMap={tagsByImageMap}/>
					</div>
				</div>
			})
		}
	</div>
}