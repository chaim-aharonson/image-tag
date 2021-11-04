import React, {useEffect, useState} from "react";
import * as _ from "lodash";
import './style/sass/App.scss';
import {ImagesContainer} from "./components/ImagesContainer";
import {image_height, image_width, LocalStorage, maxImages_default, predefinedTags} from "./common/utils";
import {TagsContainer} from "./components/TagsContainer";
const picsum_prefix = 'https://picsum.photos/seed'

const getImages = ({tags, maxImages}) => {
    const saved_images = LocalStorage.get('images') || {};
    if(!_.isEmpty(saved_images)){
        return saved_images
    }
    // TODO - leave to reset for debugging
    // LocalStorage.delete('images')
    return _.reduce(new Array(maxImages), (mem, rec, idx) =>{
        const uuid = `picsum_${idx}`;
        mem[uuid] = {
            url: `${picsum_prefix}/${uuid}/${image_width}/${image_height}`,
            label: '',
            uuid,
            width: image_width,
            height: image_height
        }
        return mem;
    }, {})
}
const getMaxImages = () => {
    let maxImages = LocalStorage.get('max_images');
    if(!maxImages){
        maxImages = maxImages_default;
        LocalStorage.set('max_images', maxImages)
    }
    return maxImages;
}
const getTagsByImageMap = ({tags}) => {
    return _.reduce(tags, (mem, tag, idx) =>{
        const {value, images} = tag;
        _.each(images, imageUuid => {
            mem[imageUuid] = mem[imageUuid] || [];
            mem[imageUuid].push(value)
        })
        return mem;
    }, {})
}
function App() {
    const [tags, setTags] = useState({});
    const [images, setImages] = useState([]);
    const [maxImages, setMaxImages] = useState(0);
    const [tagsByImageMap, setTagsByImageMap] = useState({});
    useEffect(() => {
        const _maxImages = getMaxImages();
        setMaxImages(_maxImages)
        const _tags = _.size(LocalStorage.get('tags')) ? LocalStorage.get('tags') : predefinedTags || {};
        const _tagsByImageMap = getTagsByImageMap({tags: _tags});
        setTagsByImageMap(_tagsByImageMap)
        const _images = getImages({tags: _tags, maxImages: _maxImages});
        setTags(_tags);
        setImages(_images)
    }, []);
    const updateImageTags = ({imageUuid, tagsUuids}) => {
        const _tagsByImageMap = _.cloneDeep(tagsByImageMap);
        const _tags = _.cloneDeep(tags);
        _.each(tagsUuids, tagUuid => {
            const images = _tags[tagUuid].images;
            images.push(imageUuid)
            _tags[tagUuid].images = _.uniq(images);
        })
        setTags(_tags);
        setTagsByImageMap(_tagsByImageMap)
        LocalStorage.set('tags', _tags)
    }
    const updateImageName = ({uuid, label}) => {
        const _images = _.cloneDeep(images);
        _images[uuid].label = label;
        setImages(_images)
        LocalStorage.set('images', _images)
    }
    const updateTagName = ({value, label}) => {
        const _tags = _.cloneDeep(tags);
        if(!_tags[value]){
            _tags[value] = {
                value,
                label,
                images: [],
            }
        }
        _tags[value].label = label;
        setTags(_tags);
        const _tagsByImageMap = getTagsByImageMap({tags: _tags});
        setTagsByImageMap(_tagsByImageMap)
        LocalStorage.set('tags', _tags)
    }
    return <div className='app'>
            <header className='app-header'>
                header
            </header>
            <div className='content'>
                <ImagesContainer images={images} tagsByImageMap={tagsByImageMap} tags={tags} updateImageTags={updateImageTags} updateImageName={updateImageName}/>
                <TagsContainer tags={tags} updateTagName={updateTagName}/>
            </div>
        </div>
}

export default App;
