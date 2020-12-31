import React from "react"

import Image from "../images/icons/cloud_upload-blue-48dp.svg"

function UpLoadCanvas() {
	return (
		<div className="container">
			<div className="row">
				<div className="mx-auto text-center">
					<img className="d-block rounded-lg" src={Image} alt="" height="200px" />
					<h4>Upload JSON</h4>
					<h4>to preview</h4>
				</div>
			</div>
		</div>
	)
}

export default UpLoadCanvas
