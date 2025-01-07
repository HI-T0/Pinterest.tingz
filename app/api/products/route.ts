import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import { Product } from '../../types'

const productsFilePath = path.join(process.cwd(), 'app/data/products.json')

function getProducts(): Product[] {
  const productsData = fs.readFileSync(productsFilePath, 'utf8')
  return JSON.parse(productsData)
}

function saveProducts(products: Product[]): void {
  fs.writeFileSync(productsFilePath, JSON.stringify(products, null, 2))
}

export async function GET() {
  const products = getProducts()
  return NextResponse.json(products)
}

export async function POST(request: Request) {
  const newProduct: Omit<Product, 'id'> = await request.json()
  const products = getProducts()
  const id = Math.max(...products.map(p => p.id), 0) + 1
  const productWithId = { id, ...newProduct }
  products.push(productWithId)
  saveProducts(products)
  return NextResponse.json({ success: true, product: productWithId })
}

export async function PUT(request: Request) {
  const updatedProduct: Product = await request.json()
  const products = getProducts()
  const index = products.findIndex(p => p.id === updatedProduct.id)
  if (index !== -1) {
    products[index] = updatedProduct
    saveProducts(products)
    return NextResponse.json({ success: true })
  }
  return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 })
}

export async function DELETE(request: Request) {
  const { id }: { id: number } = await request.json()
  let products = getProducts()
  products = products.filter(p => p.id !== id)
  saveProducts(products)
  return NextResponse.json({ success: true })
}

