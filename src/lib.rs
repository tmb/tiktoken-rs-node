use napi::{
  bindgen_prelude::{Error, Uint32Array, Uint8Array},
  Env, JsString, Status,
};
use napi_derive::napi;

#[napi]
pub struct Encoding {
  pub(crate) encoding: tiktoken_rs::CoreBPE,
}

#[napi]
impl Encoding {
  #[napi]
  pub fn encode(&self, text: Uint8Array) -> Result<Uint32Array, Error> {
    let text = std::str::from_utf8(text.as_ref()).map_err(|err| {
      Error::new(
        Status::GenericFailure,
        format!("Error while encoding text to UTF-8. {}", err),
      )
    })?;

    let mut tokens = self.encoding.encode_with_special_tokens(text);

    unsafe {
      Ok(Uint32Array::with_external_data(
        tokens.as_mut_ptr(),
        tokens.len(),
        move |_ptr, _len| drop(tokens),
      ))
    }
  }

  #[napi]
  pub fn decode(&self, env: Env, tokens: Uint32Array) -> Result<JsString, Error> {
    let decoded_str = self.encoding.decode(tokens.as_ref().to_vec());

    match decoded_str {
      Ok(decoded_str) => match env.create_string_from_std(decoded_str) {
        Ok(a) => Ok(a),
        Err(err) => Err(Error::new(Status::GenericFailure, err.to_string())),
      },
      Err(err) => Err(Error::new(
        Status::GenericFailure,
        format!("Error while decoding tokens to UTF-8. {}", err),
      )),
    }
  }
}

#[napi]
pub fn get_encoding(
  #[napi(
    ts_arg_type = "'gpt2' | 'r50k_base' | 'p50k_base' | 'p50k_edit' | 'cl100k_base' | 'o200k_base'"
  )]
  encoding: String,
) -> Result<Encoding, Error> {
  let encoding = match encoding.as_str() {
    "gpt2" | "r50k_base" => tiktoken_rs::r50k_base(),
    "p50k_base" => tiktoken_rs::p50k_base(),
    "p50k_edit" => tiktoken_rs::p50k_edit(),
    "cl100k_base" => tiktoken_rs::cl100k_base(),
    "o200k_base" => tiktoken_rs::o200k_base(),
    _ => return Err(Error::from_reason("Invalid encoding")),
  };

  encoding
    .map(|encoding| Encoding { encoding })
    .map_err(|err| Error::from_reason(err.to_string()))
}

#[napi]
pub fn encoding_for_model(model_name: String) -> Result<Encoding, Error> {
  tiktoken_rs::get_bpe_from_model(&model_name)
    .map(|encoding| Encoding { encoding })
    .map_err(|err| Error::from_reason(err.to_string()))
}
