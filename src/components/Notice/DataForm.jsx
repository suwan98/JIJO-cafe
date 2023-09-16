import { useId } from "react"
import Input from "@/components/Input"

function DataForm({ handleCreate, handleFileChange, fileName, data, onDataChange, setFileName }) {
  const id = useId()
  const handleTitleChange = (event) => {
    const newTitle = event.target.value
    onDataChange({ ...data, noticeTitle: newTitle })
  }

  const handleDescriptionChange = (event) => {
    const newDescription = event.target.value
    onDataChange({ ...data, noticeDescription: newDescription })
  }

  return (
    <form onSubmit={handleCreate} className="border flex gap-5 flex-col w-[53.75rem] mx-auto px-[5.625rem] py-[3.125rem]">
      <div className="flex justify-between items-center mt-[3.75rem] ">
        <Input label="관리자" value="카페 지조" readOnly required name="noticeWriter" placeholder="카페 지조" labelClassName="w-[7.8125rem] " className="bg-white block mr-[0.3125rem] border px-jj_15 w-full"></Input>
      </div>
      <div className="flex justify-between items-center">
        <Input label="제목" value={data?.noticeTitle || ""} onChange={handleTitleChange} required name="noticeTitle" placeholder="제목을 입력하세요" labelClassName="w-[7.8125rem]" className="bg-white mr-[0.3125rem] border px-jj_15 w-full"></Input>
      </div>
      <div className="flex justify-between items-center">
        <label htmlFor={id} className="w-[7.8125rem]">
          내용
        </label>
        <textarea id={id} name="noticeDescription" value={data?.noticeDescription || ""} onChange={handleDescriptionChange} className="p-[0.875rem] border rounded w-full" rows="5" cols="33"></textarea>
      </div>
      <div>
        <div className="flex items-center">
          <span className="w-[6.5rem]">파일첨부</span>
          <div>
            <div>
              <input className="hidden" name="noticeImage" type="file" id="fileInput" onChange={handleFileChange} />
              <input className="h-[2.8125rem] px-4 border border-gray-300  text-gray-500" readOnly value={data?.noticeImage || { fileName }} />
              <label htmlFor="fileInput" className="cursor-pointer font-medium ml-1 py-[0.8rem] px-10  rounded-sm bg-primary">
                업로드
              </label>
            </div>
            <p>jpg, jpeg, png파일만 첨부가능합니다</p>
          </div>
        </div>
      </div>
    </form>
  )
}

export default DataForm
