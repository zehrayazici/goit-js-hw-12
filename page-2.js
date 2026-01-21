import"./assets/modulepreload-polyfill-B5Qt9EMX.js";import{i as r,S as R,a as P}from"./assets/vendor-DeKi_rfE.js";const $="47873630-6df1888e9a425e125fd567ab2",k="https://pixabay.com/api/",m=40;document.addEventListener("DOMContentLoaded",()=>{const u=document.querySelector("#search-form"),s=document.querySelector(".gallery"),c=document.querySelector(".loader"),a=document.querySelector(".load-more");let t=1,n="",i=0,l=null;u.addEventListener("submit",g),a.addEventListener("click",p);async function g(e){if(e.preventDefault(),n=e.currentTarget.elements.query.value.trim(),!n){r.warning({message:"Please enter a search query.",position:"topRight"});return}t=1,i=0,s.innerHTML="",a.classList.add("is-hidden"),await d()}async function p(){t+=1,await d()}async function d(){c.classList.remove("is-hidden"),a.classList.add("is-hidden");try{const e=await y(n,t);if(e.hits.length===0&&t===1){r.error({message:"Sorry, there are no images matching your search query. Please try again!",position:"topRight"});return}i=e.totalHits,f(e.hits),l?l.refresh():l=new R(".gallery a",{captionsData:"alt",captionDelay:250}),t*m>=i?(a.classList.add("is-hidden"),t>1&&r.info({message:"We're sorry, but you've reached the end of search results.",position:"topRight"})):a.classList.remove("is-hidden"),t>1&&b()}catch(e){console.error(e),r.error({message:"Something went wrong. Please try again later!",position:"topRight"})}finally{c.classList.add("is-hidden")}}async function y(e,o){return(await P.get(k,{params:{key:$,q:e,image_type:"photo",orientation:"horizontal",safesearch:!0,page:o,per_page:m}})).data}function f(e){const o=e.map(({webformatURL:h,largeImageURL:L,tags:w,likes:S,views:v,comments:q,downloads:E})=>`
        <li class="gallery-item">
          <a class="gallery-link" href="${L}">
            <img src="${h}" alt="${w}" loading="lazy" />
            <div class="info">
              <p><b>Likes</b><br>${S}</p>
              <p><b>Views</b><br>${v}</p>
              <p><b>Comments</b><br>${q}</p>
              <p><b>Downloads</b><br>${E}</p>
            </div>
          </a>
        </li>
      `).join("");s.insertAdjacentHTML("beforeend",o)}function b(){const{height:e}=s.firstElementChild.getBoundingClientRect();window.scrollBy({top:e*2,behavior:"smooth"})}});
//# sourceMappingURL=page-2.js.map
