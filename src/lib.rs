use napi::{
  bindgen_prelude::{Error, Uint32Array},
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
  pub fn encode(&self, text: JsString) -> Result<Uint32Array, Error> {
    let text = text.into_utf8()?;
    let text = text.as_str()?;
    let tokens = self.encoding.encode_with_special_tokens(text);
    Ok(Uint32Array::new(tokens))
  }

  #[napi]
  pub fn decode(&self, env: Env, tokens: Uint32Array) -> Result<JsString, Error> {
    match self.encoding.decode(tokens.as_ref().to_vec()) {
      Ok(decoded_str) => env.create_string_from_std(decoded_str),
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
